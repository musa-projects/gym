import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { mapStripeStatus } from "@/lib/stripe/helpers";
import { createClient } from "@supabase/supabase-js";

// Use service role client for webhook processing (no user session)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const supabase = getAdminClient();

  try {
    switch (event.type) {
      // ---------------------------------------------------------------
      // Checkout completed -> create subscription record
      // ---------------------------------------------------------------
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const userId = session.metadata?.supabase_user_id;
          const planId = session.metadata?.plan_id;
          const billingCycle = session.metadata?.billing_cycle || "monthly";

          if (!userId || !planId) break;

          // Cancel any existing active subscription
          await supabase
            .from("member_subscriptions")
            .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
            .eq("member_id", userId)
            .in("status", ["active", "frozen"]);

          // Create new subscription record
          // In the 2026-01-28 API, period fields live on subscription items
          const firstItem = subscription.items.data[0];
          const periodEnd = new Date(firstItem.current_period_end * 1000);
          const periodStart = new Date(firstItem.current_period_start * 1000);

          await supabase.from("member_subscriptions").insert({
            member_id: userId,
            plan_id: planId,
            status: "active",
            start_date: periodStart.toISOString().split("T")[0],
            end_date: periodEnd.toISOString().split("T")[0],
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0]?.price.id,
            stripe_current_period_end: periodEnd.toISOString(),
            auto_renew: true,
          });

          // Record the payment
          await supabase.from("payments").insert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent as string,
            amount_cents: session.amount_total || 0,
            currency: session.currency || "usd",
            status: "succeeded",
            payment_type: "subscription",
            description: `${billingCycle === "yearly" ? "Annual" : "Monthly"} subscription`,
            subscription_id: planId,
            metadata: { plan_id: planId, billing_cycle: billingCycle },
          });
        }
        break;
      }

      // ---------------------------------------------------------------
      // Subscription updated (upgrade/downgrade, renewal, status change)
      // ---------------------------------------------------------------
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        const updatedItem = subscription.items.data[0];
        const periodEnd = new Date(updatedItem.current_period_end * 1000);
        const internalStatus = mapStripeStatus(subscription.status);

        await supabase
          .from("member_subscriptions")
          .update({
            status: internalStatus,
            stripe_price_id: subscription.items.data[0]?.price.id,
            stripe_current_period_end: periodEnd.toISOString(),
            end_date: periodEnd.toISOString().split("T")[0],
            cancelled_at:
              subscription.cancel_at_period_end
                ? new Date().toISOString()
                : null,
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      // ---------------------------------------------------------------
      // Subscription deleted (expired or fully cancelled)
      // ---------------------------------------------------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from("member_subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      // ---------------------------------------------------------------
      // Invoice paid -> record payment
      // ---------------------------------------------------------------
      case "invoice.paid": {
        // Use generic record to handle evolving Stripe API shape
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        // Look up user from stripe customer
        const { data: customerMapping } = await supabase
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!customerMapping) break;

        const invoiceId = invoice.id as string;

        // Avoid duplicate payment records
        const { data: existingPayment } = await supabase
          .from("payments")
          .select("id")
          .eq("stripe_invoice_id", invoiceId)
          .single();

        if (!existingPayment) {
          await supabase.from("payments").insert({
            user_id: customerMapping.user_id,
            stripe_invoice_id: invoiceId,
            stripe_payment_intent_id: (invoice.payment_intent as string) || null,
            amount_cents: (invoice.amount_paid as number) || 0,
            currency: (invoice.currency as string) || "usd",
            status: "succeeded",
            payment_type: "subscription",
            description: `Invoice ${(invoice.number as string) || invoiceId}`,
          });
        }
        break;
      }

      // ---------------------------------------------------------------
      // Invoice payment failed
      // ---------------------------------------------------------------
      case "invoice.payment_failed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        const { data: customerMapping } = await supabase
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!customerMapping) break;

        const invoiceId = invoice.id as string;

        await supabase.from("payments").insert({
          user_id: customerMapping.user_id,
          stripe_invoice_id: invoiceId,
          stripe_payment_intent_id: (invoice.payment_intent as string) || null,
          amount_cents: (invoice.amount_due as number) || 0,
          currency: (invoice.currency as string) || "usd",
          status: "failed",
          payment_type: "subscription",
          description: `Failed payment - Invoice ${(invoice.number as string) || invoiceId}`,
        });

        // Update subscription status
        const subscriptionId = invoice.subscription as string | null;
        if (subscriptionId) {
          await supabase
            .from("member_subscriptions")
            .update({ status: "pending_payment" })
            .eq("stripe_subscription_id", subscriptionId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

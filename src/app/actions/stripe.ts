"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { getOrCreateStripeCustomer } from "@/lib/stripe/helpers";

/**
 * Create a Stripe Checkout session for subscribing to a membership plan.
 */
export async function createCheckoutSession(formData: {
  priceId: string;
  planId: string;
  billingCycle: "monthly" | "yearly";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const stripeCustomerId = await getOrCreateStripeCustomer(
      user.id,
      user.email!,
      user.user_metadata?.full_name
    );

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: formData.priceId, quantity: 1 }],
      metadata: {
        supabase_user_id: user.id,
        plan_id: formData.planId,
        billing_cycle: formData.billingCycle,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/membership/cancel`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_id: formData.planId,
        },
      },
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error("Checkout session error:", error);
    return { success: false, error: "Failed to create checkout session" };
  }
}

/**
 * Create a Stripe Customer Portal session for managing billing.
 */
export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const { data: stripeCustomer } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!stripeCustomer?.stripe_customer_id) {
      return {
        success: false,
        error: "No billing account found. Please subscribe to a plan first.",
      };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/membership`,
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error("Portal session error:", error);
    return { success: false, error: "Failed to create portal session" };
  }
}

/**
 * Cancel a subscription (marks for cancellation at period end).
 */
export async function cancelSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Get active subscription
    const { data: subscription } = await supabase
      .from("member_subscriptions")
      .select("stripe_subscription_id")
      .eq("member_id", user.id)
      .in("status", ["active", "frozen"])
      .single();

    if (!subscription?.stripe_subscription_id) {
      return { success: false, error: "No active subscription found" };
    }

    // Cancel at period end (user keeps access until current period ends)
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}

/**
 * Resume a subscription that was set to cancel at period end.
 */
export async function resumeSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const { data: subscription } = await supabase
      .from("member_subscriptions")
      .select("stripe_subscription_id")
      .eq("member_id", user.id)
      .in("status", ["active", "frozen"])
      .single();

    if (!subscription?.stripe_subscription_id) {
      return { success: false, error: "No active subscription found" };
    }

    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Resume subscription error:", error);
    return { success: false, error: "Failed to resume subscription" };
  }
}

/**
 * Upgrade or downgrade a subscription to a different price.
 */
export async function changeSubscriptionPlan(newPriceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const { data: subscription } = await supabase
      .from("member_subscriptions")
      .select("stripe_subscription_id")
      .eq("member_id", user.id)
      .in("status", ["active", "frozen"])
      .single();

    if (!subscription?.stripe_subscription_id) {
      return { success: false, error: "No active subscription found" };
    }

    // Get the Stripe subscription to find the current item
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    );

    const currentItem = stripeSubscription.items.data[0];
    if (!currentItem) {
      return { success: false, error: "No subscription item found" };
    }

    // Update the subscription with the new price (proration by default)
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      items: [{ id: currentItem.id, price: newPriceId }],
      proration_behavior: "create_prorations",
    });

    return { success: true };
  } catch (error) {
    console.error("Change plan error:", error);
    return { success: false, error: "Failed to change subscription plan" };
  }
}

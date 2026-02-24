import { stripe } from "./client";
import { createClient } from "@/lib/supabase/server";

/**
 * Get or create a Stripe customer for the given Supabase user.
 */
export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string) {
  const supabase = await createClient();

  // Check if we already have a stripe customer mapping
  const { data: existing } = await supabase
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { supabase_user_id: userId },
  });

  // Store the mapping
  await supabase.from("stripe_customers").insert({
    user_id: userId,
    stripe_customer_id: customer.id,
  });

  return customer.id;
}

/**
 * Map Stripe subscription status to our internal status.
 */
export function mapStripeStatus(
  stripeStatus: string
): "active" | "frozen" | "cancelled" | "expired" | "pending_payment" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "pending_payment";
    case "canceled":
      return "cancelled";
    case "paused":
      return "frozen";
    default:
      return "expired";
  }
}

/**
 * Determine the plan tier from a Stripe price ID by looking up our membership_plans table.
 */
export async function getPlanFromStripePrice(stripePriceId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("membership_plans")
    .select("*")
    .or(`stripe_monthly_price_id.eq.${stripePriceId},stripe_yearly_price_id.eq.${stripePriceId}`)
    .single();

  return data;
}

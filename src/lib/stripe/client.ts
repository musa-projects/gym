import Stripe from "stripe";

// Server-side Stripe instance - NEVER import this in client components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

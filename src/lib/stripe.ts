import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_for_build", {
  apiVersion: "2026-07-29.dahlia",
  appInfo: {
    name: "Reziyume Pro",
    version: "0.1.0",
  },
});

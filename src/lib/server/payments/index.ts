import Stripe from "stripe";

import { STRIPE_API_KEY } from "$env/static/private";
export { StripeServices } from "./services";

export const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2024-04-10",
});

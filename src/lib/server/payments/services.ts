import { Stripe } from "stripe";

import { logger } from "$lib/logger";

import { stripe } from ".";

/**
 * Update the current subscription to stop recurring payments at the end of the current pay period.
 *
 * @param subscriptionId - The ID of the subscription to be canceled.
 * @returns A Promise that resolves to the canceled subscription object, or undefined if an error occurs.
 */
const cancelSubscription = async (subscriptionId: string): Promise<Stripe.Subscription | undefined> => {
  try {
    return await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  } catch (error) {
    logger.error(error);
  }
};

/**
 * Retrieves a Stripe Checkout session by session ID.
 *
 * @param sessionId - The ID of the session to retrieve.
 * @returns A Promise that resolves to the session object if found, or undefined if not found.
 */
const getSession = async (sessionId: string): Promise<Stripe.Checkout.Session | undefined> => {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
  } catch (error) {
    logger.error(error);
  }
};

/**
 * Retrieves a subscription from Stripe.
 *
 * @param subscriptionId - The ID of the subscription to retrieve.
 * @returns A Promise that resolves to the subscription object if found, or undefined if not found.
 */
const getSubscription = async (subscriptionId: string): Promise<Stripe.Subscription | undefined> => {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    logger.error(error);
  }
};

/**
 * Creates a new subscription session for the given price ID.
 *
 * @param priceId - The ID of the price for the subscription.
 * @param customerId - The ID of the customer for the subscription.
 * @param origin - The origin url
 * @returns A Promise that resolves to the session object representing the created subscription session, or undefined if an error occurred.
 */
const activateSubscription = async (priceId: string, customerId: string, origin: string): Promise<Stripe.Checkout.Session | undefined> => {
  try {
    return await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      customer: customerId,
      return_url: `${origin}/order/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/error`,
    });
  } catch (error) {
    logger.error(error);
  }
};

const getCustomer = async (customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer | undefined> => {
  try {
    return await stripe.customers.retrieve(customerId, { expand: ["subscriptions"] });
  } catch (error) {
    logger.error(error);
  }
};

const createCustomer = async (name: string, email: string): Promise<Stripe.Customer | undefined> => {
  try {
    return await stripe.customers.create({ name, email });
  } catch (error) {
    logger.error(error);
  }
};

const getProduct = async (productId: string): Promise<Stripe.Product | undefined> => {
  try {
    return await stripe.products.retrieve(productId);
  } catch (error) {
    logger.error(error);
  }
};

export const StripeServices = {
  cancelSubscription,
  getSubscription,
  activateSubscription,
  getSession,
  getCustomer,
  createCustomer,
  getProduct,
};

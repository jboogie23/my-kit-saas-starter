import type Stripe from "stripe";
import { redirect } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";

import { STRIPE_CLIENT_SECRET } from "$configs/cookies-names";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { updateUserById } from "$server/db/users";
import { StripeServices } from "$server/payments";
import { isUserAuthenticated } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { type SubscribeFormSchema, subscribeFormSchema } from "$validations/app";
import { type CancelSubscriptionFormSchema, cancelSubscriptionFormSchema } from "$validations/app";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const form = await superValidate<SubscribeFormSchema>(zod(subscribeFormSchema));

  return { form };
};

export const actions = {
  subscribe: async (event) => {
    const { request, locals, url, cookies } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isUserAuthenticated(locals, cookies, url);

    const form = await superValidate<SubscribeFormSchema>(request, zod(subscribeFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(form.errors);

      return message(form, flashMessage);
    }

    let customer: Stripe.Customer | undefined;
    if (!locals.user.customerId) {
      customer = await StripeServices.createCustomer(locals.user.name, locals.user.email);
      if (!customer) {
        flashMessage.text = "Error while creating stripe customer";
        logger.error(flashMessage.text);

        return message(form, flashMessage);
      }

      const updatedUser = updateUserById(locals.db, locals.user.id, { customerId: customer.id });
      if (!updatedUser) {
        flashMessage.text = "Something went wrong!";
        logger.error("Something went wrong");

        return message(form, flashMessage);
      }
    }

    const customerId = customer ? customer.id : locals.user.customerId;
    const { priceId } = form.data;
    const { origin } = event.url;

    const session = await StripeServices.activateSubscription(priceId, customerId, origin);
    if (!session?.client_secret) {
      flashMessage.text = "Error while subscribing";
      logger.debug("Error while subscribing");

      redirect(route("/order/error"), flashMessage, event);
    }

    cookies.set(STRIPE_CLIENT_SECRET, session.client_secret, { path: "/", httpOnly: true, secure: true });

    redirect(302, route("/order/checkout"));
  },

  cancel: async (event) => {
    const { request, locals, url, cookies } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isUserAuthenticated(locals, cookies, url);

    const form = await superValidate<CancelSubscriptionFormSchema>(request, zod(cancelSubscriptionFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(form.errors);

      return message(form, flashMessage);
    }

    const subscription = await StripeServices.cancelSubscription(form.data.subscriptionId);
    if (!subscription) {
      flashMessage.text = "Error while canceling subscription";
      logger.debug("Error while canceling subscription");

      redirect(route("/order/error"), flashMessage, event);
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = "Subscription is canceled";

    redirect(route("/order/canceled"), flashMessage, event);
  },
} satisfies Actions;

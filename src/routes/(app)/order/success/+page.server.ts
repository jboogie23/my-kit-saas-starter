import type Stripe from "stripe";
import { redirect } from "sveltekit-flash-message/server";

import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { updateUserById } from "$server/db/users";
import { StripeServices } from "$server/payments";
import { isUserAuthenticated } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
  const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

  isUserAuthenticated(locals, cookies, url);

  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    logger.error("sessionId not found");
    redirect(302, route("/order/error"));
  }

  const session = await StripeServices.getSession(sessionId);
  if (session?.payment_status != "paid") {
    redirect(302, route("/order/error"));
  }

  const { id: subscriptionId, status: subscriptionStatus } = session.subscription as Stripe.Subscription;

  const updatedUser = await updateUserById(locals.db, locals.user.id, { subscriptionId, subscriptionStatus });
  if (!updatedUser) {
    flashMessage.text = m.core_form_shared_failedToUpdateUser();
    logger.error("Failed to update user post checkout");

    redirect(route("/order/error"), flashMessage, cookies);
  }

  return {};
};

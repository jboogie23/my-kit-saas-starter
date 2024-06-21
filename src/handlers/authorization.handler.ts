import { error, type Handle } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";

import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";

export const authorization: Handle = async ({ event, resolve }) => {
  const {
    locals,
    route: { id },
  } = event;

  const flashMessage = { status: FlashMessageStatus.SUCCESS, text: "" };

  logger.debug(`ROUTE: ${id}`);

  const isAuthenticated = !!locals.user;
  const isVerified = !!locals.user?.isVerified;
  const isAdmin = !!locals.user?.isAdmin;
  const isAdminRoute = !!id?.startsWith("/(app)/admin");
  const isUserRoute = !!id?.startsWith("/(app)/app");
  const isProtectedRoute = isUserRoute || isAdminRoute;

  // if user is trying to access a protected route and it's not verified
  if (isProtectedRoute && isAuthenticated && !isVerified) {
    logger.debug(`Redirect to ${route("/auth/verify-email")} route because user is not verified`);

    flashMessage.text = m.flash_verifyEmail();

    redirect(route("/auth/verify-email"), flashMessage, event.cookies);
  }

  // if user is trying to access admin protected route and it's not an admin
  if (isAdminRoute && isAuthenticated && !isAdmin) {
    logger.debug(`Throwing 404 because someone is trying to access admin section and it is not admin`);

    // TODO should I change this?
    error(404);
  }

  // if user is trying to access an user protected route and it's not authenticated
  if (isUserRoute && !isAuthenticated) {
    const redirectTo = event.url.pathname;

    flashMessage.text = m.flash_login();

    logger.debug(`Redirect to ${route("/auth/login", { redirectTo })} route because user is not authenticated`);

    redirect(route("/auth/login", { redirectTo }), flashMessage, event.cookies);
  }

  return resolve(event);
};

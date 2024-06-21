import { type Cookies, error } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";

import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";

type User = App.Locals["user"];
type Session = App.Locals["session"];
type NoNullUserAndSessionField<T> = {
  [K in keyof T]: T[K] extends User | Session ? NonNullable<T[K]> : T[K];
};

type DefinedUserAndSession = NoNullUserAndSessionField<App.Locals>;

/**
 * Checks if the user is anonymous.
 * Redirects them to the dashboard if they are not.
 *
 * @param {App.Locals} locals - The locals object of RequestEvent.
 * @returns void
 */
export function isAnonymous(locals: App.Locals) {
  if (locals.user && locals.session) redirect(303, route("/app/dashboard"));
}

/**
 * Checks if the user is authenticated.
 * Redirects them to the login page if they are not.
 *
 * @param {URL} url - The URL object.
 * @param {App.Locals} locals - The locals object of RequestEvent.
 * @param {Cookies} cookies - The cookies object of RequestEvent.
 * @returns void
 */
export function isUserAuthenticated(locals: App.Locals, cookies: Cookies, url: URL): asserts locals is DefinedUserAndSession {
  if (!locals.user && !locals.session) {
    const redirectTo = url.pathname;
    const flashMessage = { status: FlashMessageStatus.SUCCESS, text: m.flash_login() };

    redirect(route("/auth/login", { redirectTo }), flashMessage, cookies);
  }
}

/**
 * Checks if the user is authenticated and is not verified.
 * Redirects them to the dashboard if they are not.
 *
 * @param {URL} url - The URL object.
 * @param {App.Locals} locals - The locals object of RequestEvent.
 * @param {Cookies} cookies - The cookies object of RequestEvent.
 * @returns void
 */
export function isUserNotVerified(locals: App.Locals, cookies: Cookies, url: URL): asserts locals is DefinedUserAndSession {
  isUserAuthenticated(locals, cookies, url);

  if (locals.user?.isVerified) {
    const flashMessage = { status: FlashMessageStatus.SUCCESS, text: m.flash_alreadyVerified() };

    redirect(route("/app/dashboard"), flashMessage, cookies);
  }
}

/**
 * Checks if the user is authenticated and has admin privileges.
 * Redirects them to the dashboard if they are not.
 *
 * @param {URL} url - The URL object.
 * @param {App.Locals} locals - The locals object of RequestEvent.
 * @param {Cookies} cookies - The cookies object of RequestEvent.
 * @returns void
 */
export function isUserAdmin(locals: App.Locals, cookies: Cookies, url: URL): asserts locals is DefinedUserAndSession {
  isUserAuthenticated(locals, cookies, url);

  if (!locals.user?.isAdmin) error(404);
}

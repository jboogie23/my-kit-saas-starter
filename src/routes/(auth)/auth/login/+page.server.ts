import { fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";
import { verifyPassword } from "worker-password-auth";

import { loginLimiter } from "$configs/rate-limiters/auth";
import { AUTH_SECRET } from "$env/static/private";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { createAndSetSession } from "$server/auth/auth-utils";
import { getUserByEmail } from "$server/db/users";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$server/security";
import { AuthMethods } from "$types/enums/auth-methods.enum";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { type LoginFormSchema, loginFormSchema } from "$validations/auth";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<LoginFormSchema>(zod(loginFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isAnonymous(locals);

    const minutes = await verifyRateLimiter(event, loginLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<LoginFormSchema>(request, zod(loginFormSchema));
    const { email, password, turnstileToken } = form.data;
    form.data.password = "";

    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(form.errors);

      return message(form, flashMessage);
    }

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = m.core_form_shared_invalidTurnstile();
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const existingUser = await getUserByEmail(locals.db, email);
    if (existingUser && !existingUser.password && !existingUser.authMethods.includes(AuthMethods.EMAIL)) {
      flashMessage.text = m.auth_login_registeredWithOauth();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 403 });
    }

    const validPassword = await verifyPassword(password + AUTH_SECRET + existingUser?.id, existingUser?.password ?? "");
    if (!validPassword) {
      flashMessage.text = m.core_form_shared_invalidEmailOrPassword();
      logger.debug(flashMessage.text);

      // return error for both case (invalid user and invalid password)
      // at the same time to prevent time based attack on login form
      return message(form, flashMessage, { status: 400 });
    }

    await createAndSetSession(locals.lucia, existingUser!.id, cookies);

    let redirectTo = url.searchParams.get("redirectTo");
    if (redirectTo) {
      // with this line we are forcing to redirect to our domain
      // for example, if they pass a malicious domain like example.com/auth/login?redirectTo=http://virus.com
      // the redirect to the malicious domain won't work because this will throw a 404
      // instead if it's a legit url like example.com/auth/login?redirectTo=/admin it will work as usual
      redirectTo = `/${redirectTo.slice(1)}`;
    }

    redirect(303, redirectTo ?? route("/app/dashboard"));
  },
};

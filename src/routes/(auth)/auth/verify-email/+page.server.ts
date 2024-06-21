import { type Actions, fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";

import { resendVerifyEmailLimiter, verifyEmailLimiter } from "$configs/rate-limiters/auth";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { createAndSetSession, generateToken, verifyToken } from "$server/auth/auth-utils";
import { getUserByEmail, updateUserById } from "$server/db/users";
import { sendEmailVerificationEmail, sendWelcomeEmail } from "$server/email/send";
import { isUserNotVerified, validateTurnstileToken, verifyRateLimiter } from "$server/security";
import { AuthMethods } from "$types/enums/auth-methods.enum";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { TokenType } from "$types/enums/token-type.enum";
import { type VerifyEmailFormSchema, verifyEmailFormSchema } from "$validations/auth";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, cookies, url }) => {
  isUserNotVerified(locals, cookies, url);

  const form = await superValidate<VerifyEmailFormSchema>(zod(verifyEmailFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  confirm: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isUserNotVerified(locals, cookies, url);

    const minutes = await verifyRateLimiter(event, verifyEmailLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<VerifyEmailFormSchema>(request, zod(verifyEmailFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const { id: userId, email, name } = locals.user;
    const { token, turnstileToken } = form.data;
    const ip = getClientAddress();

    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = m.core_form_shared_invalidTurnstile();
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const isValidToken = await verifyToken(locals.db, userId, token, TokenType.EMAIL_VERIFICATION, email);
    if (!isValidToken) {
      flashMessage.text = m.core_form_shared_invalidToken();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    await locals.lucia.invalidateUserSessions(userId);

    const existingUser = await getUserByEmail(locals.db, email);
    if (!existingUser) {
      flashMessage.text = m.core_form_shared_userNotFound();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 404 });
    }

    const authMethods = existingUser.authMethods ?? [];
    authMethods.push(AuthMethods.EMAIL);

    const updatedUser = await updateUserById(locals.db, userId, { isVerified: true, authMethods });
    if (!updatedUser) {
      flashMessage.text = m.core_form_shared_failedToUpdateUser();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 404 });
    }

    await createAndSetSession(locals.lucia, userId, cookies);
    await sendWelcomeEmail(email, name);

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.auth_verifyEmail_emailVerifiedSuccessfully();

    redirect(route("/app/dashboard"), flashMessage, cookies);
  },

  resendEmail: async (event) => {
    const { locals, url, cookies } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isUserNotVerified(locals, cookies, url);

    const minutes = await verifyRateLimiter(event, resendVerifyEmailLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const { id: userId, name, email } = locals.user;

    const newToken = await generateToken(locals.db, userId, email, TokenType.EMAIL_VERIFICATION);
    if (!newToken) {
      flashMessage.text = m.core_form_shared_failedToGenerateToken();
      logger.error(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(500);
    }

    const mailSent = await sendEmailVerificationEmail(email, name, newToken.token);
    if (!mailSent) {
      flashMessage.text = m.core_form_shared_failedToSendEmail();
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(500);
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.core_form_shared_emailSentSuccessfully();

    redirect(route("/auth/verify-email"), flashMessage, cookies);
  },
};

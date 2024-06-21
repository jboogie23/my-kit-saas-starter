import { type Actions, fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { resetPasswordLimiter } from "$configs/rate-limiters/auth";
import { resendResetPasswordLimiter } from "$configs/rate-limiters/auth";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { generateToken, verifyToken } from "$server/auth/auth-utils";
import { getUserById } from "$server/db/users";
import { sendPasswordResetEmail } from "$server/email/send";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { TokenType } from "$types/enums/token-type.enum";
import { type ResetPasswordSecondStepFormSchema, resetPasswordSecondStepFormSchema } from "$validations/auth";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, params }) => {
  isAnonymous(locals);
  const { userId } = params;

  const form = await superValidate<ResetPasswordSecondStepFormSchema>(zod(resetPasswordSecondStepFormSchema));

  return { form, userId };
}) satisfies PageServerLoad;

export const actions: Actions = {
  confirm: async (event) => {
    const { request, locals, cookies, params, getClientAddress } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isAnonymous(locals);

    const minutes = await verifyRateLimiter(event, resetPasswordLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<ResetPasswordSecondStepFormSchema>(request, zod(resetPasswordSecondStepFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const { token, turnstileToken } = form.data;
    const userId = params.userId as string;
    const user = await getUserById(locals.db, userId);
    if (!user) {
      flashMessage.text = m.core_form_shared_userNotFound();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 404 });
    }

    const { email } = user;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = m.core_form_shared_invalidTurnstile();
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const isValidToken = await verifyToken(locals.db, userId, token, TokenType.PASSWORD_RESET, email);
    if (!isValidToken) {
      flashMessage.text = m.core_form_shared_invalidToken();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.core_form_shared_emailSentSuccessfully();

    redirect(route("/auth/reset-password/[userId=userId]/new-password", { userId }), flashMessage, cookies);
  },

  resendEmail: async (event) => {
    const { locals, cookies, params } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isAnonymous(locals);

    const minutes = await verifyRateLimiter(event, resendResetPasswordLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const userId = params.userId as string;
    const user = await getUserById(locals.db, userId);
    if (!user) {
      flashMessage.text = m.core_form_shared_userNotFound();
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(500);
    }

    const { email } = user;

    const newToken = await generateToken(locals.db, userId, email, TokenType.PASSWORD_RESET);
    if (!newToken) {
      flashMessage.text = m.core_form_shared_failedToGenerateToken();
      logger.error(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(500);
    }

    const mailSent = await sendPasswordResetEmail(email, newToken.token);
    if (!mailSent) {
      flashMessage.text = m.core_form_shared_failedToSendEmail();
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(500);
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.core_form_shared_emailSentSuccessfully();

    redirect(route("/auth/reset-password/[userId=userId]", { userId }), flashMessage, cookies);
  },
};

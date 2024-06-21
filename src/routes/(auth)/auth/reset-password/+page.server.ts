import { type Actions, fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";

import { resetPasswordLimiter } from "$configs/rate-limiters/auth";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { generateToken } from "$server/auth/auth-utils";
import { getUserByEmail } from "$server/db/users";
import { sendPasswordResetEmail } from "$server/email/send";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { TokenType } from "$types/enums/token-type.enum";
import { type ResetPasswordFirstStepFormSchema, resetPasswordFirstStepFormSchema } from "$validations/auth";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<ResetPasswordFirstStepFormSchema>(zod(resetPasswordFirstStepFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, cookies, getClientAddress } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isAnonymous(locals);

    const minutes = await verifyRateLimiter(event, resetPasswordLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<ResetPasswordFirstStepFormSchema>(request, zod(resetPasswordFirstStepFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const { email, turnstileToken } = form.data;
    const ip = getClientAddress();

    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = m.core_form_shared_invalidTurnstile();
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const userFromDb = await getUserByEmail(locals.db, email);
    if (!userFromDb) {
      flashMessage.status = FlashMessageStatus.SUCCESS;
      flashMessage.text = m.core_form_shared_emailSentSuccessfully();

      // we send a success message even if the user doesn't exist to prevent email enumeration
      redirect(route("/"), flashMessage, cookies);
    }

    const { id: userId } = userFromDb;

    const newToken = await generateToken(locals.db, userId, email, TokenType.PASSWORD_RESET);
    if (!newToken) {
      flashMessage.text = m.core_form_shared_failedToGenerateToken();
      logger.error(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    const mailSent = await sendPasswordResetEmail(email, newToken.token);
    if (!mailSent) {
      flashMessage.text = m.core_form_shared_failedToSendEmail();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.core_form_shared_emailSentSuccessfully();

    redirect(route("/auth/reset-password/[userId=userId]", { userId }), flashMessage, cookies);
  },
};

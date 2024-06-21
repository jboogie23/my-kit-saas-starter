import { type Actions, fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";

import { changeEmailLimiter } from "$configs/rate-limiters/auth";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { generateToken } from "$server/auth/auth-utils";
import { getUserByEmail } from "$server/db/users";
import { sendEmailChangeEmail } from "$server/email/send";
import { isUserAuthenticated, validateTurnstileToken, verifyRateLimiter } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { TokenType } from "$types/enums/token-type.enum";
import { type ChangeEmailFirstStepFormSchema, changeEmailFirstStepFormSchema } from "$validations/auth";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const form = await superValidate<ChangeEmailFirstStepFormSchema>(zod(changeEmailFirstStepFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isUserAuthenticated(locals, cookies, url);

    const minutes = await verifyRateLimiter(event, changeEmailLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<ChangeEmailFirstStepFormSchema>(request, zod(changeEmailFirstStepFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const { id: userId, name } = locals.user;
    const { email: newEmail, turnstileToken } = form.data;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = m.core_form_shared_invalidTurnstile();
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const existingUser = await getUserByEmail(locals.db, newEmail);
    if (existingUser) {
      flashMessage.text = m.auth_changeEmail_emailAlreadyUsed();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 401 });
    }

    const newToken = await generateToken(locals.db, userId, newEmail, TokenType.EMAIL_CHANGE);
    if (!newToken) {
      flashMessage.text = m.core_form_shared_failedToGenerateToken();
      logger.error(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    const mailSent = await sendEmailChangeEmail(newEmail, name, newToken.token);
    if (!mailSent) {
      flashMessage.text = m.core_form_shared_failedToSendEmail();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.core_form_shared_emailSentSuccessfully();

    redirect(route("/auth/change-email/confirm"), flashMessage, cookies);
  },
};

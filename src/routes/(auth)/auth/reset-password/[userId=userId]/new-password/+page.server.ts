import { fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { hashPassword } from "worker-password-auth";

import { resetPasswordLimiter } from "$configs/rate-limiters/auth";
import { AUTH_SECRET } from "$env/static/private";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { updateUserById } from "$server/db/users";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { type ResetPasswordThirdStepFormSchema, resetPasswordThirdStepFormSchema } from "$validations/auth";

import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<ResetPasswordThirdStepFormSchema>(zod(resetPasswordThirdStepFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
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

    const form = await superValidate<ResetPasswordThirdStepFormSchema>(request, zod(resetPasswordThirdStepFormSchema));

    const { password, turnstileToken } = form.data;

    form.data.password = "";
    form.data.passwordConfirm = "";

    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = m.core_form_shared_invalidTurnstile();
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const { userId } = params;

    await locals.lucia.invalidateUserSessions(userId);

    const hashedPassword = await hashPassword(password + AUTH_SECRET + userId);

    const updatedUser = await updateUserById(locals.db, userId, { password: hashedPassword });
    if (!updatedUser) {
      flashMessage.text = m.core_form_shared_failedToUpdateUser();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.auth_resetPassword_resetPasswordSuccessfully();

    redirect(route("/auth/login"), flashMessage, cookies);
  },
};

import { fail } from "@sveltejs/kit";
import { generateId } from "lucia";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";
import { hashPassword } from "worker-password-auth";

import { USER_ID_LEN } from "$configs/fields-length";
import { registerLimiter } from "$configs/rate-limiters/auth";
import { AUTH_SECRET } from "$env/static/private";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { createAndSetSession, generateToken } from "$server/auth/auth-utils";
import { createUser, getUserByEmail, updateUserById } from "$server/db/users";
import { sendEmailVerificationEmail } from "$server/email/send";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$server/security";
import { AuthMethods } from "$types/enums/auth-methods.enum";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { TokenType } from "$types/enums/token-type.enum";
import { type RegisterFormSchema, registerFormSchema } from "$validations/auth";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<RegisterFormSchema>(zod(registerFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, cookies, getClientAddress } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isAnonymous(locals);

    const minutes = await verifyRateLimiter(event, registerLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<RegisterFormSchema>(request, zod(registerFormSchema));

    const { name, email, password, turnstileToken } = form.data;

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

    const existingUser = await getUserByEmail(locals.db, email);
    if (existingUser && existingUser.authMethods.includes(AuthMethods.EMAIL)) {
      flashMessage.text = m.auth_register_emailAlreadyUsed();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const userId = existingUser?.id ?? generateId(USER_ID_LEN);
    const hashedPassword = await hashPassword(password + AUTH_SECRET + userId);

    if (!existingUser) {
      const newUser = await createUser(locals.db, {
        id: userId,
        name,
        email,
        username: email.split("@")[0] + generateId(5),
        password: hashedPassword,
        isVerified: false,
        isAdmin: false,
        authMethods: [],
      });

      if (!newUser) {
        flashMessage.text = m.auth_register_failed();
        logger.debug(flashMessage.text);

        return message(form, flashMessage, { status: 400 });
      }
    } else {
      const updatedUser = await updateUserById(locals.db, existingUser.id, { password: hashedPassword, isVerified: false });

      if (!updatedUser) {
        flashMessage.text = m.auth_register_failed();
        logger.debug(flashMessage.text);

        return message(form, flashMessage, { status: 400 });
      }
    }

    const newToken = await generateToken(locals.db, userId, email, TokenType.EMAIL_VERIFICATION);
    if (!newToken) {
      flashMessage.text = m.core_form_shared_failedToGenerateToken();
      logger.error(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    const res = await sendEmailVerificationEmail(email, name, newToken.token);
    if (!res) {
      flashMessage.text = m.core_form_shared_failedToSendEmail();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    await createAndSetSession(locals.lucia, userId, cookies);

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = m.auth_register_accountCreatedSuccessfully();

    redirect(route("/auth/verify-email"), flashMessage, cookies);
  },
};

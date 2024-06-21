import { type Actions, fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { accountSettingsLimiter } from "$configs/rate-limiters/app";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { updateUserById } from "$server/db/users";
import { isUserAuthenticated, verifyRateLimiter } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { type SettingsAccountFormSchema, settingsAccountFormSchema } from "$validations/app/settings";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const { user } = locals;

  const form = await superValidate<SettingsAccountFormSchema>({ name: user.name }, zod(settingsAccountFormSchema));

  return { form, user };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isUserAuthenticated(locals, cookies, url);

    const minutes = await verifyRateLimiter(event, accountSettingsLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<SettingsAccountFormSchema>(request, zod(settingsAccountFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const { name } = form.data;
    const { id: userId } = locals.user;

    const updatedUser = await updateUserById(locals.db, userId, { name });
    if (!updatedUser) {
      flashMessage.text = m.core_form_shared_userNotFound();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = "Account updated successfully";

    redirect(route("/settings/account"), flashMessage, cookies);
  },
};

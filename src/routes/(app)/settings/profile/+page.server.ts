import { type Actions, fail } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { profileSettingsLimiter } from "$configs/rate-limiters/app";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import * as m from "$paraglide/messages";
import { getUserByUsername, updateUserById } from "$server/db/users";
import { isUserAuthenticated, verifyRateLimiter } from "$server/security";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { type SettingsProfileFormSchema, settingsProfileFormSchema } from "$validations/app/settings";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const { user } = locals;

  const form = await superValidate<SettingsProfileFormSchema>({ username: user.username }, zod(settingsProfileFormSchema));

  return { form, user };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies } = event;
    const flashMessage = { status: FlashMessageStatus.ERROR, text: "" };

    isUserAuthenticated(locals, cookies, url);

    const minutes = await verifyRateLimiter(event, profileSettingsLimiter);
    if (minutes) {
      flashMessage.text = m.core_form_shared_tooManyRequest({ minutes });
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<SettingsProfileFormSchema>(request, zod(settingsProfileFormSchema));
    if (!form.valid) {
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const { username } = form.data;
    const { id: userId } = locals.user;

    const existingUser = await getUserByUsername(locals.db, username);
    if (existingUser && existingUser.id !== userId) {
      flashMessage.text = "Username already taken";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const updatedUser = await updateUserById(locals.db, userId, { username });
    if (!updatedUser) {
      flashMessage.text = m.core_form_shared_userNotFound();
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    flashMessage.status = FlashMessageStatus.SUCCESS;
    flashMessage.text = "Profile updated successfully";

    redirect(route("/settings/profile"), flashMessage, cookies);
  },
};

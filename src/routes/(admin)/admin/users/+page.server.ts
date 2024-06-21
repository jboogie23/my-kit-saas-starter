import { type Actions } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";

import { logger } from "$lib/logger";
import * as m from "$paraglide/messages";
import { deleteUserById, getAllUsers, updateUserById } from "$server/db/users";
import { FlashMessageStatus } from "$types/enums/flash-message-status.enum";
import { type DeleteUserFormSchema, deleteUserFormSchema, type UpdateUserFormSchema, updateUserFormSchema } from "$validations/admin/database";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { db } }) => {
  const users = await getAllUsers(db);

  return { users };
}) satisfies PageServerLoad;

export const actions: Actions = {
  deleteUser: async ({ request, cookies, locals: { db } }) => {
    const flashMessage = { status: FlashMessageStatus.SUCCESS, text: "User successfully deleted!" };

    const form = await superValidate<DeleteUserFormSchema>(request, zod(deleteUserFormSchema));
    if (!form.valid) {
      flashMessage.status = FlashMessageStatus.ERROR;
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.error(flashMessage.text);

      return message(form, flashMessage);
    }

    const { userId } = form.data;

    const deletedUser = await deleteUserById(db, userId);
    if (!deletedUser) {
      logger.debug("Something went wrong");
      flashMessage.status = FlashMessageStatus.ERROR;
      flashMessage.text = "Something went wrong!";

      setFlash(flashMessage, cookies);
      return;
    }

    setFlash(flashMessage, cookies);
  },

  updateUser: async ({ request, cookies, locals: { db } }) => {
    const flashMessage = { status: FlashMessageStatus.SUCCESS, text: "User successfully updated!" };

    const form = await superValidate<UpdateUserFormSchema>(request, zod(updateUserFormSchema));
    if (!form.valid) {
      flashMessage.status = FlashMessageStatus.ERROR;
      flashMessage.text = m.core_form_shared_invalidForm();
      logger.error(flashMessage.text);

      return message(form, flashMessage);
    }

    const { userId, name, email, username, isVerified, isAdmin } = form.data;

    const updatedUser = await updateUserById(db, userId, { name, email, username, isVerified, isAdmin });
    if (!updatedUser) {
      logger.debug("Something went wrong");
      flashMessage.status = FlashMessageStatus.ERROR;
      flashMessage.text = "Something went wrong!";

      setFlash(flashMessage, cookies);
      return;
    }

    setFlash(flashMessage, cookies);
  },
};

import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { emailField, isAdminField, isVerifiedField, nameField, userIdField, usernameField } from "$validations/core";

export const deleteUserFormSchema = z.object({ userId: userIdField });
export type DeleteUserFormSchema = Infer<typeof deleteUserFormSchema>;

export const updateUserFormSchema = z.object({
  userId: userIdField,
  email: emailField,
  name: nameField,
  username: usernameField,
  isVerified: isVerifiedField,
  isAdmin: isAdminField,
});
export type UpdateUserFormSchema = Infer<typeof updateUserFormSchema>;

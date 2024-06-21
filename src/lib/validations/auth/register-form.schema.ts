import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import {
  emailField,
  nameField,
  passwordConfirmField,
  passwordConfirmMustBeEqualToPassword,
  passwordField,
  turnstileTokenField,
} from "$validations/core";

const registerFormSchema = z
  .object({ name: nameField, email: emailField, password: passwordField, passwordConfirm: passwordConfirmField, turnstileToken: turnstileTokenField })
  .superRefine(passwordConfirmMustBeEqualToPassword);

type RegisterFormSchema = Infer<typeof registerFormSchema>;

export { type RegisterFormSchema, registerFormSchema };

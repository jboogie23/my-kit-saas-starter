import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import {
  emailField,
  passwordConfirmField,
  passwordConfirmMustBeEqualToPassword,
  passwordField,
  tokenField,
  turnstileTokenField,
} from "$validations/core";

/**
 * First step
 * We need to verify the email submitted by user
 */
const resetPasswordFirstStepFormSchema = z.object({ email: emailField, turnstileToken: turnstileTokenField });
type ResetPasswordFirstStepFormSchema = Infer<typeof resetPasswordFirstStepFormSchema>;

/**
 * Second step
 * We need to verify the token submitted by user
 */
const resetPasswordSecondStepFormSchema = z.object({ token: tokenField, turnstileToken: turnstileTokenField });
type ResetPasswordSecondStepFormSchema = Infer<typeof resetPasswordSecondStepFormSchema>;

/**
 * Third step
 * We need to verify both password and passwordConfirm submitted by user
 */
const resetPasswordThirdStepFormSchema = z
  .object({ password: passwordField, passwordConfirm: passwordConfirmField, turnstileToken: turnstileTokenField })
  .superRefine(passwordConfirmMustBeEqualToPassword);
type ResetPasswordThirdStepFormSchema = Infer<typeof resetPasswordThirdStepFormSchema>;

export {
  type ResetPasswordFirstStepFormSchema,
  resetPasswordFirstStepFormSchema,
  type ResetPasswordSecondStepFormSchema,
  resetPasswordSecondStepFormSchema,
  type ResetPasswordThirdStepFormSchema,
  resetPasswordThirdStepFormSchema,
};

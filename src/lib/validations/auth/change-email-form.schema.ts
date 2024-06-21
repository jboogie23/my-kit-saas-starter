import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { emailField, tokenField, turnstileTokenField } from "$validations/core";

/**
 * First step
 * We need to verify the new email submitted by user
 */
const changeEmailFirstStepFormSchema = z.object({ email: emailField, turnstileToken: turnstileTokenField });
type ChangeEmailFirstStepFormSchema = Infer<typeof changeEmailFirstStepFormSchema>;

/**
 * Second step
 * We need to verify the token submitted by user
 */
const changeEmailSecondStepFormSchema = z.object({ token: tokenField, turnstileToken: turnstileTokenField });
type ChangeEmailSecondStepFormSchema = Infer<typeof changeEmailSecondStepFormSchema>;

export { type ChangeEmailFirstStepFormSchema, changeEmailFirstStepFormSchema, type ChangeEmailSecondStepFormSchema, changeEmailSecondStepFormSchema };

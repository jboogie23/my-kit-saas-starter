import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { tokenField, turnstileTokenField } from "$validations/core";

const verifyEmailFormSchema = z.object({ token: tokenField, turnstileToken: turnstileTokenField });

type VerifyEmailFormSchema = Infer<typeof verifyEmailFormSchema>;

export { type VerifyEmailFormSchema, verifyEmailFormSchema };

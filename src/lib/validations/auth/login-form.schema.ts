import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { emailField, passwordField, turnstileTokenField } from "$validations/core";

const loginFormSchema = z.object({ email: emailField, password: passwordField, turnstileToken: turnstileTokenField });

type LoginFormSchema = Infer<typeof loginFormSchema>;

export { type LoginFormSchema, loginFormSchema };

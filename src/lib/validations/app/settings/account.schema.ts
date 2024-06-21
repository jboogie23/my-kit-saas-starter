import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { nameField } from "$validations/core";

const settingsAccountFormSchema = z.object({ name: nameField });

type SettingsAccountFormSchema = Infer<typeof settingsAccountFormSchema>;

export { type SettingsAccountFormSchema, settingsAccountFormSchema };

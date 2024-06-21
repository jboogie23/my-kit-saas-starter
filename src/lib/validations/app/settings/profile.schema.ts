import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { usernameField } from "$validations/core";

const settingsProfileFormSchema = z.object({ username: usernameField });

type SettingsProfileFormSchema = Infer<typeof settingsProfileFormSchema>;

export { type SettingsProfileFormSchema, settingsProfileFormSchema };

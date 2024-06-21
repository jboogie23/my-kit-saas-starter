import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { nameField } from "$validations/core";

const settingsNotificationsFormSchema = z.object({ name: nameField });

type SettingsNotificationsFormSchema = Infer<typeof settingsNotificationsFormSchema>;

export { type SettingsNotificationsFormSchema, settingsNotificationsFormSchema };

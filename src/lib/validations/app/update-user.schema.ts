import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { nameField } from "$validations/core";

// TODO implement this schema
const updateUserFormSchema = z.object({ name: nameField });

type UpdateUserFormSchema = Infer<typeof updateUserFormSchema>;

export { type UpdateUserFormSchema, updateUserFormSchema };

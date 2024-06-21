import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { priceIdField } from "$validations/core";

const subscribeFormSchema = z.object({ priceId: priceIdField });

type SubscribeFormSchema = Infer<typeof subscribeFormSchema>;

export { type SubscribeFormSchema, subscribeFormSchema };

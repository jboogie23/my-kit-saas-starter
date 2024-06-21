import type { Infer } from "sveltekit-superforms";
import { z } from "zod";

import { subscriptionIdField } from "$validations/core";

const cancelSubscriptionFormSchema = z.object({ subscriptionId: subscriptionIdField });

type CancelSubscriptionFormSchema = Infer<typeof cancelSubscriptionFormSchema>;

export { type CancelSubscriptionFormSchema, cancelSubscriptionFormSchema };

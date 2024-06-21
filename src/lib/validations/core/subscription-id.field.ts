import { z } from "zod";

import * as m from "$paraglide/messages";

const subscriptionIdField = z.string({ required_error: m.validation_subscriptionId_isRequired() }).trim().startsWith("sub_");

export { subscriptionIdField };

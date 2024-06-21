import { z } from "zod";

import * as m from "$paraglide/messages";

const priceIdField = z.string({ required_error: m.validation_priceId_isRequired() }).trim().startsWith("price_");

export { priceIdField };

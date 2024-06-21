import { z } from "zod";

import * as m from "$paraglide/messages";

const turnstileTokenField = z.string({ required_error: m.validation_turnstile_isRequired() });

export { turnstileTokenField };

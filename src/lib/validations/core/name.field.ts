import { z } from "zod";

import { NAME_MAX_LEN, NAME_MIN_LEN } from "$configs/fields-length";
import * as m from "$paraglide/messages";

const nameField = z
  .string({ required_error: m.validation_name_isRequired() })
  .trim()
  .min(NAME_MIN_LEN, { message: m.validation_name_minLength({ min: NAME_MIN_LEN }) })
  .max(NAME_MAX_LEN, { message: m.validation_name_maxLength({ max: NAME_MAX_LEN }) });

export { nameField };

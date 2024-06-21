import { z } from "zod";

import { USERNAME_MAX_LEN, USERNAME_MIN_LEN } from "$configs/fields-length";
import * as m from "$paraglide/messages";

// TODO add regex that checks for alphanumeric characters only
const usernameField = z
  .string({ required_error: m.validation_username_isValid() })
  .trim()
  .min(USERNAME_MIN_LEN, { message: m.validation_username_minLength({ min: USERNAME_MIN_LEN }) })
  .max(USERNAME_MAX_LEN, { message: m.validation_username_maxLength({ max: USERNAME_MAX_LEN }) });

export { usernameField };

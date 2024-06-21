import { z } from "zod";

import { EMAIL_MAX_LEN, EMAIL_MIN_LEN } from "$configs/fields-length";
import * as m from "$paraglide/messages";

const emailField = z
  .string({ required_error: m.validation_email_isRequired() })
  .trim()
  .email({ message: m.validation_email_isValid() })
  .min(EMAIL_MIN_LEN, { message: m.validation_email_minLength({ min: EMAIL_MIN_LEN }) })
  .max(EMAIL_MAX_LEN, { message: m.validation_email_maxLength({ max: EMAIL_MAX_LEN }) });

export { emailField };

import { z } from "zod";

import { TOKEN_LEN } from "$configs/fields-length";
import * as m from "$paraglide/messages";

// TODO add regex to check for lowercases, uppercases and numbers
const tokenField = z
  .string({ required_error: m.validation_token_isRequired() })
  .trim()
  .length(TOKEN_LEN, { message: m.validation_token_length({ len: TOKEN_LEN }) });

export { tokenField };

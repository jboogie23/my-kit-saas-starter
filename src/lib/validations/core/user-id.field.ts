import { z } from "zod";

import { USER_ID_LEN } from "$configs/fields-length";
import * as m from "$paraglide/messages";

// TODO add regex to check lowercase and numbers
const userIdField = z
  .string({ required_error: m.validation_userId_isRequired() })
  .trim()
  .length(USER_ID_LEN, { message: m.validation_userId_length({ len: USER_ID_LEN }) });

export { userIdField };

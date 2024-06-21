import { z } from "zod";

import * as m from "$paraglide/messages";

// no need to add validation, because this field depends on password one
const passwordConfirmField = z.string({ required_error: "Password confirm is required" });

type EqualPasswords = { password: string; passwordConfirm: string };

const passwordConfirmMustBeEqualToPassword = ({ password, passwordConfirm }: EqualPasswords, ctx: z.RefinementCtx) => {
  if (passwordConfirm.length > 0 && password !== passwordConfirm) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: m.validation_passwordConfirm_mismatch(),
      path: ["password"],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: m.validation_passwordConfirm_mismatch(),
      path: ["passwordConfirm"],
    });
  }
};

export { passwordConfirmField, passwordConfirmMustBeEqualToPassword };

import { createI18n } from "@inlang/paraglide-sveltekit";

import * as runtime from "$paraglide/runtime";

// TODO is this the correct way?
export const i18n = createI18n(runtime, {
  pathnames: {
    "/legal/terms-and-conditions": {
      en: "/legal/terms-and-conditions",
      it: "/legale/termini-e-condizioni",
    },
    "/legal/privacy-policy": {
      en: "/legal/privacy-policy",
      it: "/legale/privacy-policy",
    },
    "/legal/cookie-policy": {
      en: "/legal/cookie-policy",
      it: "/legale/cookie-policy",
    },
    // or use a message function (recommended)
    // "/admin": m.admin_path
  },
});

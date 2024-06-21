import { loadFlash } from "sveltekit-flash-message/server";

import type { LayoutServerLoad } from "./$types";

export const load = loadFlash(async ({ url, locals, depends }) => {
  depends("paraglide:lang");

  return { url: url.pathname, user: locals.user };
}) satisfies LayoutServerLoad;

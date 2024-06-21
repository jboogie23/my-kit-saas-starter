import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
  return { url: url.pathname, user: locals.user };
}) satisfies LayoutServerLoad;

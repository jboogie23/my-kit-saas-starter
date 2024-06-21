import { redirect } from "@sveltejs/kit";

import { route } from "$lib/ROUTES";
import { destroySession } from "$server/auth/auth-utils";
import { isUserAuthenticated } from "$server/security";

import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ locals, url, cookies }) => {
    isUserAuthenticated(locals, cookies, url);

    await locals.lucia.invalidateSession(locals.session.id);
    destroySession(locals.lucia, cookies);

    redirect(302, route("/"));
  },
} satisfies Actions;

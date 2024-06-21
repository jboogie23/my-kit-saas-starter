import { redirect } from "sveltekit-flash-message/server";

import { route } from "$lib/ROUTES";

import type { PageServerLoad } from "./$types";

export const load = (async () => {
  redirect(303, route("/settings/profile"));
}) satisfies PageServerLoad;

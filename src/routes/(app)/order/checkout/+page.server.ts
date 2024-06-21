import { error } from "@sveltejs/kit";

import { STRIPE_CLIENT_SECRET } from "$configs/cookies-names";
import { logger } from "$lib/logger";
import { isUserAuthenticated } from "$server/security";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const clientSecret = cookies.get(STRIPE_CLIENT_SECRET);
  if (!clientSecret) {
    logger.warn("Stripe clientSecret cookie not found");
    error(500, "Client secret not found");
  }

  return { clientSecret };
};

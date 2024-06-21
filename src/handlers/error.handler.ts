import type { HandleServerError } from "@sveltejs/kit";

import { logger } from "$lib/logger";

// TODO implement this handler
export const error: HandleServerError = ({ status, message, error }) => {
  if (status !== 404) {
    logger.error(error);
  }

  // do not return sensitive data here as it will be sent to the client
  return { message };
};

import type { RequestEvent } from "@sveltejs/kit";
import type { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";

import { ONE_MINUTE_IN_SECONDS } from "$constants/time";

/**
 * Verifies the rate limiter for a given request event.
 *
 * @param {RequestEvent} event - The request event to be checked.
 * @param {RetryAfterRateLimiter} limiter - The rate limiter to be used for checking the event.
 * @returns {string} - A string representation of the retry after time in minutes if the event is limited, otherwise undefined.
 */
export async function verifyRateLimiter(event: RequestEvent, limiter: RetryAfterRateLimiter): Promise<string> {
  const status = await limiter.check(event);
  let retryAfter = "";

  if (status.limited) {
    const retryAfterInMinutes = Math.round(status.retryAfter / ONE_MINUTE_IN_SECONDS);
    retryAfter = retryAfterInMinutes.toString();
  }

  return retryAfter;
}

import { StripeServices } from "$server/payments";
import { isUserAuthenticated } from "$server/security";

import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const subscription = await StripeServices.getSubscription(locals.user.subscriptionId);
  if (!subscription) return {};
  const { cancel_at_period_end: isCanceled, current_period_end: subscriptionEndDate, status, id: subscriptionId } = subscription;

  const productId = subscription.items.data.find((s) => s.subscription === locals.user.subscriptionId)?.plan.product as string;

  const product = await StripeServices.getProduct(productId);
  if (!product) return {};
  const { name } = product;

  // TODO remove hardcoded locale
  return { subscriptionId, status, isCanceled, subscriptionEndDate, name, locale: "en-US" };
}) satisfies PageServerLoad;

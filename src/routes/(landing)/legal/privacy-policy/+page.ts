import type { MetaTagsProps } from "svelte-meta-tags";

import * as m from "$paraglide/messages";

import type { PageLoad } from "./$types";

export const load = (() => {
  const pageMetaTags = Object.freeze({ title: m.privacyPolicy() }) satisfies MetaTagsProps;

  return { pageMetaTags };
}) satisfies PageLoad;

import type { MetaTagsProps } from "svelte-meta-tags";

import { APP_DESCRIPTION, APP_NAME } from "$configs/general";

export const load = ({ url }) => {
  const baseMetaTags = Object.freeze({
    title: "Default",
    titleTemplate: `%s | ${APP_NAME}`,
    description: APP_DESCRIPTION,
    canonical: new URL(url.pathname, url.origin).href,
    // openGraph: {
    //   type: "website",
    //   url: new URL(url.pathname, url.origin).href,
    //   locale: "en_IE",
    //   title: "Open Graph Title",
    //   description: "Open Graph Description",
    //   siteName: "SiteName",
    //   images: [
    //     {
    //       url: "https://www.example.ie/og-image.jpg",
    //       alt: "Og Image Alt",
    //       width: 800,
    //       height: 600,
    //       secureUrl: "https://www.example.ie/og-image.jpg",
    //       type: "image/jpeg"
    //     }
    //   ]
    // }
  }) satisfies MetaTagsProps;

  return { baseMetaTags };
};

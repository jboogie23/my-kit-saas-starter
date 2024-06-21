import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { kitRoutes } from "vite-plugin-kit-routes";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import { defineConfig } from "vitest/config";

import type { KIT_ROUTES } from "$lib/ROUTES";

import * as LINKS from "./src/lib/configs/links";

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    paraglide({
      project: "./project.inlang",
      outdir: "./src/paraglide",
    }),
    sveltekit(),
    kitRoutes<KIT_ROUTES>({
      post_update_run: "npm exec prettier ./src/lib/ROUTES.ts -- -w",
      LINKS: {
        // socials
        discord: LINKS.DISCORD,
        facebook: LINKS.FACEBOOK,
        github: LINKS.GITHUB,
        instagram: LINKS.INSTAGRAM,
        tiktok: LINKS.TIKTOK,
        twitter: LINKS.TWITTER,

        // tools
        svelte: LINKS.SVELTE,
        tailwind: LINKS.TAILWIND,
        drizzle: LINKS.DRIZZLE,
        lucia: LINKS.LUCIA,
      },
      PAGES: {
        "/auth/login": {
          explicit_search_params: {
            redirectTo: { type: "string" },
          },
        },
        "/order/success": {
          explicit_search_params: {
            sessionId: { type: "string" },
          },
        },
      },
    }),
  ],
  test: {
    coverage: {
      enabled: true,
      reporter: ["html"],
    },
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});

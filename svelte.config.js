import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    alias: {
      $components: "src/lib/components",
      $configs: "src/lib/configs",
      $constants: "src/lib/constants",
      $server: "src/lib/server",
      $stores: "src/lib/stores",
      $utils: "src/lib/utils",
      $validations: "src/lib/validations",
      $paraglide: "src/paraglide",
      $types: "src/lib/types",
    },
  },
};

export default config;

<script lang="ts">
  import "../app.pcss";

  import { ParaglideJS } from "@inlang/paraglide-sveltekit";
  import extend from "just-extend";
  import { ModeWatcher } from "mode-watcher";
  import { MetaTags } from "svelte-meta-tags";
  import { toast } from "svelte-sonner";
  import { getFlash } from "sveltekit-flash-message";
  import { setupViewTransition } from "sveltekit-view-transition";

  import { page } from "$app/stores";
  import { Loader } from "$components/layout";
  import { Toaster } from "$components/ui/sonner";
  import { i18n } from "$lib/i18n";
  import { navigationDelayed } from "$stores/navigation-delayed.store";

  setupViewTransition();

  let { children, data } = $props();

  let flash = $derived(getFlash(page));
  let metaTags = $derived(extend(true, {}, data.baseMetaTags, $page.data.pageMetaTags));

  $effect(() => {
    if (!$flash) return;

    const { status, text } = $flash;

    switch (status) {
      case "success":
        toast.success(text);
        break;
      case "info":
        toast.info(text);
        break;
      case "warning":
        toast.warning(text);
        break;
      case "error":
        toast.error(text);
        break;
    }
  });
</script>

<MetaTags {...metaTags} />

<ParaglideJS {i18n}>
  {#if $navigationDelayed}
    <Loader />
  {:else}
    <ModeWatcher />
    <Toaster richColors closeButton position={"top-center"} />
    {@render children()}
  {/if}
</ParaglideJS>

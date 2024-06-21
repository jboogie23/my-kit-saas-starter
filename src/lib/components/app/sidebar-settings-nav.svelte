<script lang="ts">
  import { cubicInOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  import { page } from "$app/stores";
  import { Button } from "$components/ui/button";
  import { cn } from "$lib/utils/style-transitions";

  type Props = {
    // TODO delete this any
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    items: { href: string; title: string; icon: any }[];
    class?: string;
  };

  let { class: className, items }: Props = $props();

  const [send, receive] = crossfade({ duration: 250, easing: cubicInOut });
</script>

<nav class={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}>
  {#each items as { title, href, icon }}
    {@const isActive = $page.url.pathname === href}

    <Button {href} variant="ghost" class={cn(!isActive && "hover:underline", "relative justify-start hover:bg-transparent")} data-sveltekit-noscroll>
      {#if isActive}
        <div class="absolute inset-0 rounded-md bg-muted" in:send={{ key: "active-sidebar-tab" }} out:receive={{ key: "active-sidebar-tab" }}></div>
      {/if}
      <div class="relative flex items-center gap-2">
        <svelte:component this={icon} size={24} />
        {title}
      </div>
    </Button>
  {/each}
</nav>

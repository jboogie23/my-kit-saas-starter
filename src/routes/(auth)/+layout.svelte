<script lang="ts">
  import { Logo } from "$components/layout";
  import { route } from "$lib/ROUTES";

  let { children } = $props();
</script>

<section class="flex min-h-screen w-screen flex-col items-center justify-center py-8">
  <div class="flex w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-8 lg:py-0">
    <Logo href={route("/")} hidden={false} />

    {@render children()}
  </div>
</section>

<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import { route } from "$lib/ROUTES";

  let { data } = $props();
</script>

<div class="flex flex-col">
  <div class="mb-6">Thank you <span class="font-bold">{data.user?.name}</span> for your purchase!</div>
  <Button href={route("/app/dashboard")}>Go to Dashboard</Button>
</div>

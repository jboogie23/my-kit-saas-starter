<script lang="ts">
  import TriangleAlert from "lucide-svelte/icons/triangle-alert";

  import { enhance } from "$app/forms";
  import Badge from "$components/ui/badge/badge.svelte";
  import { Button } from "$components/ui/button";
  import { Input } from "$components/ui/input";
  import * as Alert from "$lib/components/ui/alert";
  import { route } from "$lib/ROUTES.js";

  let { data } = $props();

  let cancelDate = $derived(new Date(data.subscriptionEndDate ?? 0 * 1000).toLocaleString(data.locale));
</script>

{#if data.status}
  <div class="mt-2 flex flex-col gap-4">
    {#if data.isCanceled}
      <Alert.Root variant="destructive">
        <TriangleAlert size={24} class="mt-1" />
        <Alert.Title>Subscription canceled!</Alert.Title>
        <Alert.Description>Subscription will end at {cancelDate}</Alert.Description>
      </Alert.Root>
    {/if}
    <div>Status: <Badge>{data.status}</Badge></div>
    <div>Plan: <Badge>{data.name}</Badge></div>

    <div class="flex gap-4">
      <Button href={route("/order")}>Upgrade</Button>

      <form method="post" action={route("cancel /order")} use:enhance>
        <Input name="subscriptionId" value={data.subscriptionId} type="hidden" />

        <Button type="submit" variant="destructive">Cancel subscription</Button>
      </form>
    </div>
  </div>
{:else}
  No subscription found.
{/if}

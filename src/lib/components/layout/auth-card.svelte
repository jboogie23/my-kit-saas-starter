<script lang="ts">
  import type { Snippet } from "svelte";

  import * as Card from "$components/ui/card";

  type Props = {
    title: Snippet;
    content: Snippet;
    footer?: Snippet;
  };
  let { title, content, footer }: Props = $props();
</script>

<Card.Root class="w-full">
  <Card.Header class="space-y-1">
    <Card.Title class="text-2xl">
      {@render title()}
    </Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    {@render content()}
  </Card.Content>
  {#if footer}
    <Card.Footer>
      {@render footer()}
    </Card.Footer>
  {/if}
</Card.Root>

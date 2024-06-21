<script lang="ts">
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import type { Readable } from "svelte/store";

  import * as Form from "$components/ui/form";
  import * as m from "$paraglide/messages";

  type Props = {
    delayed: Readable<boolean>;
    label: string;
  };
  let { delayed, label }: Props = $props();
</script>

<Form.Button disabled={$delayed}>
  {#if $delayed}
    <LoaderCircle class="mr-2 h-4 w-4 animate-spin" /> {m.core_form_shared_label_loading()}
  {:else}
    {label}
  {/if}
</Form.Button>

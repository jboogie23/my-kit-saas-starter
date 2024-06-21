<script lang="ts">
  import { enhance } from "$app/forms";
  import * as m from "$paraglide/messages";

  type Props = { action: string };
  let { action }: Props = $props();
</script>

<form class="mx-1 flex flex-col" method="post" {action} use:enhance>
  <button type="submit" class="underline">{m.core_form_shared_label_resendEmail()}</button>
</form>

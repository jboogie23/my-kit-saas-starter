<script lang="ts">
  import { turnstile } from "@svelte-put/cloudflare-turnstile";

  import { PUBLIC_CLOUDFLARE_TURNSTILE_KEY } from "$env/static/public";
  import type { TurnstileActions } from "$types/enums";

  type Props = { action: TurnstileActions };

  let { action }: Props = $props();
</script>

<div
  use:turnstile
  turnstile-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_KEY}
  turnstile-response-field-name="turnstileToken"
  turnstile-response-field
  turnstile-appearance="interaction-only"
  turnstile-action={action}
></div>

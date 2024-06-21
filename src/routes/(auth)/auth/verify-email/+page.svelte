<script lang="ts">
  import { ResendEmailForm, VerifyEmailForm } from "$components/forms/auth";
  import { AuthCard } from "$components/layout";
  import { route } from "$lib/ROUTES.js";
  import * as m from "$paraglide/messages";

  let { data } = $props();
</script>

<AuthCard>
  {#snippet title()}
    {m.auth_verifyEmail_title()}
  {/snippet}

  {#snippet content()}
    <div class="text-muted-foreground">
      {m.auth_verifyEmail_description()}
    </div>
    <VerifyEmailForm {data} />
  {/snippet}

  {#snippet footer()}
    {m.core_form_shared_emailNotReceived()}
    <ResendEmailForm action={route("resendEmail /auth/verify-email")} />
  {/snippet}
</AuthCard>

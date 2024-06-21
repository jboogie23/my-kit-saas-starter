<script lang="ts">
  import { ChangeEmailSecondStepForm, ResendEmailForm } from "$components/forms/auth";
  import { AuthCard } from "$components/layout";
  import { route } from "$lib/ROUTES";
  import * as m from "$paraglide/messages";

  let { data } = $props();
</script>

<AuthCard>
  {#snippet title()}
    {m.auth_changeEmail_title()}
  {/snippet}

  {#snippet content()}
    <div class="text-muted-foreground">
      {m.auth_changeEmail_step2_description()}
    </div>
    <ChangeEmailSecondStepForm {data} />
  {/snippet}

  {#snippet footer()}
    {m.core_form_shared_emailNotReceived()}
    <ResendEmailForm action={route("resendEmail /auth/change-email/confirm")} />
  {/snippet}
</AuthCard>

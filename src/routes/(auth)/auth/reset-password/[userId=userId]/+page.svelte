<script lang="ts">
  import { ResendEmailForm } from "$components/forms/auth";
  import { ResetPasswordSecondStepForm } from "$components/forms/auth";
  import { AuthCard } from "$components/layout";
  import { route } from "$lib/ROUTES";
  import * as m from "$paraglide/messages";

  let { data } = $props();
</script>

<AuthCard>
  {#snippet title()}
    {m.auth_resetPassword_title()}
  {/snippet}

  {#snippet content()}
    <div class="text-muted-foreground">
      {m.auth_resetPassword_step2_description()}
    </div>
    <ResetPasswordSecondStepForm {data} />
  {/snippet}

  {#snippet footer()}
    {m.core_form_shared_emailNotReceived()}
    <ResendEmailForm action={route("resendEmail /auth/reset-password/[userId=userId]", { userId: data.userId })} />
  {/snippet}
</AuthCard>

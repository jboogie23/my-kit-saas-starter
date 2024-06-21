<script lang="ts">
  import { ResetPasswordThirdStepForm } from "$components/forms/auth";
  import { AuthCard } from "$components/layout";
  import * as m from "$paraglide/messages";

  let { data } = $props();
</script>

<AuthCard>
  {#snippet title()}
    {m.auth_resetPassword_title()}
  {/snippet}

  {#snippet content()}
    <div class="text-muted-foreground">
      {m.auth_resetPassword_step3_description()}
    </div>
    <ResetPasswordThirdStepForm {data} />
  {/snippet}
</AuthCard>

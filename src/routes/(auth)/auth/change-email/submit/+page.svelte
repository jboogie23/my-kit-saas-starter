<script lang="ts">
  import { ChangeEmailFirstStepForm } from "$components/forms/auth";
  import { AuthCard } from "$components/layout";
  import * as m from "$paraglide/messages";

  let { data } = $props();
</script>

<AuthCard>
  {#snippet title()}
    {m.auth_changeEmail_title()}
  {/snippet}

  {#snippet content()}
    <div class="text-muted-foreground">
      {m.auth_changeEmail_step1_description()}
    </div>
    <ChangeEmailFirstStepForm {data} />
  {/snippet}
</AuthCard>

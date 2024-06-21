<script lang="ts">
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, EmailFormField } from "$components/form-fields";
  import { Turnstile } from "$components/layout";
  import * as m from "$paraglide/messages";
  import { TurnstileActions } from "$types/enums";
  import { type ChangeEmailFirstStepFormSchema, changeEmailFirstStepFormSchema } from "$validations/auth";

  type Props = {
    data: {
      form: SuperValidated<ChangeEmailFirstStepFormSchema>;
    };
  };
  let { data }: Props = $props();

  const form = superForm(data.form, { validators: zodClient(changeEmailFirstStepFormSchema) });
  const { enhance, delayed } = form;
</script>

<form class="flex flex-col" method="post" use:enhance>
  <EmailFormField {form} />
  <Turnstile action={TurnstileActions.CHANGE_EMAIL_SUBMIT} />
  <ConfirmButtonFormField {delayed} label={m.core_form_shared_label_verify()} />
</form>

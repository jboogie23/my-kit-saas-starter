<script lang="ts">
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, PasswordConfirmFormField, PasswordFormField } from "$components/form-fields";
  import { Turnstile } from "$components/layout";
  import * as m from "$paraglide/messages";
  import { TurnstileActions } from "$types/enums";
  import { type ResetPasswordThirdStepFormSchema, resetPasswordThirdStepFormSchema } from "$validations/auth";

  type Props = {
    data: {
      form: SuperValidated<ResetPasswordThirdStepFormSchema>;
    };
  };
  let { data }: Props = $props();

  const form = superForm(data.form, { validators: zodClient(resetPasswordThirdStepFormSchema) });
  const { enhance, delayed } = form;
</script>

<form class="flex flex-col gap-3" method="post" use:enhance>
  <PasswordFormField {form} showHelper={true} />
  <PasswordConfirmFormField {form} />
  <Turnstile action={TurnstileActions.RESET_PASSWORD_CHANGE} />
  <ConfirmButtonFormField {delayed} label={m.core_form_shared_label_verify()} />
</form>

<script lang="ts">
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, EmailFormField, NameFormField, PasswordConfirmFormField, PasswordFormField } from "$components/form-fields";
  import { Turnstile } from "$components/layout";
  import * as m from "$paraglide/messages";
  import { TurnstileActions } from "$types/enums";
  import { type RegisterFormSchema, registerFormSchema } from "$validations/auth";

  type Props = {
    data: {
      form: SuperValidated<RegisterFormSchema>;
    };
  };
  let { data }: Props = $props();

  const form = superForm(data.form, { validators: zodClient(registerFormSchema) });
  const { enhance, delayed } = form;
</script>

<form class="flex flex-col gap-2" method="post" use:enhance>
  <NameFormField {form} />
  <EmailFormField {form} />
  <PasswordFormField {form} showHelper={true} />
  <PasswordConfirmFormField {form} />
  <Turnstile action={TurnstileActions.REGISTER} />
  <ConfirmButtonFormField {delayed} label={m.core_form_shared_label_register()} />
</form>

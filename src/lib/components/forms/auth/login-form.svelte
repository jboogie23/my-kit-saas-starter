<script lang="ts">
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, EmailFormField, PasswordFormField } from "$components/form-fields";
  import { Turnstile } from "$components/layout";
  import { route } from "$lib/ROUTES.js";
  import * as m from "$paraglide/messages";
  import { TurnstileActions } from "$types/enums";
  import { type LoginFormSchema, loginFormSchema } from "$validations/auth";

  type Props = {
    data: {
      form: SuperValidated<LoginFormSchema>;
    };
  };
  let { data }: Props = $props();

  const form = superForm(data.form, { validators: zodClient(loginFormSchema) });
  const { enhance, delayed } = form;
</script>

<form class="flex flex-col gap-2" method="post" use:enhance>
  <EmailFormField {form} />
  <PasswordFormField {form} />
  <a href={route("/auth/reset-password")} class="flex justify-end text-right text-sm font-medium hover:underline">
    {m.auth_login_forgotPassword()}
  </a>
  <Turnstile action={TurnstileActions.LOGIN} />
  <ConfirmButtonFormField {delayed} label={m.core_form_shared_label_login()} />
</form>

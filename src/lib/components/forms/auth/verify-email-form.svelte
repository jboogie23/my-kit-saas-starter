<script lang="ts">
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, TokenFormField } from "$components/form-fields";
  import { Turnstile } from "$components/layout";
  import { route } from "$lib/ROUTES";
  import * as m from "$paraglide/messages";
  import { TurnstileActions } from "$types/enums";
  import { type VerifyEmailFormSchema, verifyEmailFormSchema } from "$validations/auth";

  type Props = {
    data: {
      form: SuperValidated<VerifyEmailFormSchema>;
    };
  };
  let { data }: Props = $props();

  const form = superForm(data.form, { validators: zodClient(verifyEmailFormSchema) });
  const { enhance, delayed } = form;
</script>

<form class="flex flex-col" method="post" action={route("confirm /auth/verify-email")} use:enhance>
  <TokenFormField {form} />
  <Turnstile action={TurnstileActions.VERIFY_EMAIL} />
  <ConfirmButtonFormField {delayed} label={m.core_form_shared_label_verify()} />
</form>

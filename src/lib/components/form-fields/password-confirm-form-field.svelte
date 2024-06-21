<script lang="ts" generics="T extends PasswordConfirmFormField">
  import type { SuperForm } from "sveltekit-superforms";

  import * as Form from "$components/ui/form";
  import { Input } from "$components/ui/input";
  import * as m from "$paraglide/messages";

  type Props = { form: SuperForm<T> };
  let { form }: Props = $props();

  const { form: formData } = form;
</script>

<Form.Field {form} name="passwordConfirm" class="space-y-1">
  <Form.Control let:attrs>
    <Form.Label>{m.core_form_shared_label_passwordConfirm()}</Form.Label>
    <Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
  </Form.Control>
  <Form.FieldErrors class="h-4 text-xs" />
</Form.Field>

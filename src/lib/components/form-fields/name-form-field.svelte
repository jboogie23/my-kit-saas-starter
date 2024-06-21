<script lang="ts" generics="T extends NameFormField">
  import type { SuperForm } from "sveltekit-superforms";

  import * as Form from "$components/ui/form";
  import { Input } from "$components/ui/input";
  import * as m from "$paraglide/messages";

  type Props = { form: SuperForm<T> };
  let { form }: Props = $props();

  const { form: formData } = form;
</script>

<Form.Field {form} name="name" class="space-y-1">
  <Form.Control let:attrs>
    <Form.Label>{m.core_form_shared_label_name()}</Form.Label>
    <Input {...attrs} type="name" bind:value={$formData.name} />
  </Form.Control>
  <Form.FieldErrors class="h-4 text-xs" />
</Form.Field>

<script lang="ts" generics="T extends IsAdminFormField">
  // import * as m from "$paraglide/messages";
  import type { SuperForm } from "sveltekit-superforms";

  import * as Form from "$components/ui/form";
  import Switch from "$components/ui/switch/switch.svelte";

  type Props = { form: SuperForm<T> };
  let { form }: Props = $props();

  const { form: formData } = form;
</script>

<Form.Field {form} name="isAdmin" class="space-y-1">
  <Form.Control let:attrs>
    <!-- TODO translate this label -->
    <Form.Label>Is admin?</Form.Label>
    <Switch {...attrs} checked={$formData.isAdmin} />
  </Form.Control>
  <Form.FieldErrors class="h-4 text-xs" />
</Form.Field>

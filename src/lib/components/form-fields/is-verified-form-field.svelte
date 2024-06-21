<script lang="ts" generics="T extends IsVerifiedFormField">
  // import * as m from "$paraglide/messages";
  import type { SuperForm } from "sveltekit-superforms";

  import * as Form from "$components/ui/form";
  import Switch from "$components/ui/switch/switch.svelte";

  type Props = { form: SuperForm<T> };
  let { form }: Props = $props();

  const { form: formData } = form;
</script>

<Form.Field {form} name="isVerified" class="space-y-1">
  <Form.Control let:attrs>
    <!-- TODO translate this label -->
    <Form.Label>Is verified?</Form.Label>
    <Switch {...attrs} checked={$formData.isVerified} />
  </Form.Control>
  <Form.FieldErrors class="h-4 text-xs" />
</Form.Field>

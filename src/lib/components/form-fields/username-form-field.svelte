<script lang="ts" generics="T extends UsernameFormField">
  import type { SuperForm } from "sveltekit-superforms";

  import * as Form from "$components/ui/form";
  import { Input } from "$components/ui/input";

  type Props = { form: SuperForm<T> };
  let { form }: Props = $props();

  const { form: formData } = form;
</script>

<Form.Field {form} name="username" class="space-y-1">
  <Form.Control let:attrs>
    <!-- TODO translate this label -->
    <Form.Label>Username</Form.Label>
    <Input {...attrs} type="text" bind:value={$formData.username} />
  </Form.Control>
  <!-- TODO translate or delete this description -->
  <!-- <Form.Description>This is your public display name. You can only change this once every 30 days.</Form.Description> -->
  <Form.FieldErrors class="h-4 text-xs" />
</Form.Field>

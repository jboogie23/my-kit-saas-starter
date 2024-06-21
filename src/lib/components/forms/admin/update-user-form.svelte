<script lang="ts">
  // import * as m from "$paraglide/messages";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import {
    ConfirmButtonFormField,
    EmailFormField,
    IsAdminFormField,
    IsVerifiedFormField,
    NameFormField,
    UsernameFormField,
  } from "$components/form-fields";
  import { Input } from "$components/ui/input";
  import { route } from "$lib/ROUTES";
  import { type UpdateUserFormSchema, updateUserFormSchema } from "$validations/admin/database";

  type Props = { currentUser: UpdateUserFormSchema };
  const { currentUser }: Props = $props();

  const form = superForm(currentUser, { validators: zodClient(updateUserFormSchema) });
  const { delayed, enhance } = form;
</script>

<form method="post" action={route("updateUser /admin/users")} use:enhance class="flex flex-col gap-4">
  <Input name="userId" value={currentUser.userId} type="hidden" />
  <NameFormField {form} />
  <EmailFormField {form} />
  <UsernameFormField {form} />
  <IsVerifiedFormField {form} />
  <IsAdminFormField {form} />
  <!-- TODO translate this label -->
  <ConfirmButtonFormField {delayed} label={"Save changes"} />
</form>

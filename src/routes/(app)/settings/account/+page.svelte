<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, NameFormField } from "$components/form-fields";
  import { Separator } from "$components/ui/separator";
  import { settingsAccountFormSchema } from "$validations/app/settings";

  let { data } = $props();

  const form = superForm(data.form, { validators: zodClient(settingsAccountFormSchema) });
  const { enhance, delayed } = form;
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium">Account</h3>
    <p class="text-sm text-muted-foreground">Update your account settings. Set your preferred language and timezone.</p>
  </div>
  <Separator />
  <form method="post" class="space-y-8" use:enhance>
    <NameFormField {form} />
    <!-- TODO translate this label -->
    <ConfirmButtonFormField {delayed} label={"Update account"} />
  </form>
</div>

<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, NameFormField } from "$components/form-fields";
  import { Separator } from "$components/ui/separator";
  import { settingsNotificationsFormSchema } from "$validations/app/settings";

  let { data } = $props();

  const form = superForm(data.form, { validators: zodClient(settingsNotificationsFormSchema) });
  const { enhance, delayed } = form;
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium">Notifications</h3>
    <p class="text-sm text-muted-foreground">Configure how you receive notifications.</p>
  </div>
  <Separator />
  <form class="flex flex-col gap-2" method="post" use:enhance>
    <NameFormField {form} />
    <!-- TODO translate this label -->
    <ConfirmButtonFormField {delayed} label={"Update notifications"} />
  </form>
</div>

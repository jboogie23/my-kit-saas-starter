<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  import { ConfirmButtonFormField, UsernameFormField } from "$components/form-fields";
  import { Separator } from "$components/ui/separator";
  import { settingsProfileFormSchema } from "$validations/app/settings";

  let { data } = $props();

  const form = superForm(data.form, { validators: zodClient(settingsProfileFormSchema) });
  const { enhance, delayed } = form;
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium">Profile</h3>
    <p class="text-sm text-muted-foreground">This is how others will see you on the site.</p>
  </div>
  <Separator />
  <form class="flex flex-col gap-2" method="post" use:enhance>
    <UsernameFormField {form} />
    <!-- TODO translate this label -->
    <ConfirmButtonFormField {delayed} label={"Update profile"} />
  </form>
</div>

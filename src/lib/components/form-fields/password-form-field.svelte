<script lang="ts" generics="T extends PasswordFormField">
  import { type FirstOption, type Option, passwordStrength, type Result } from "check-password-strength";
  import Eye from "lucide-svelte/icons/eye";
  import EyeOff from "lucide-svelte/icons/eye-off";
  import type { SuperForm } from "sveltekit-superforms";

  import { PasswordStrength } from "$components/layout";
  import { Button } from "$components/ui/button";
  import * as Form from "$components/ui/form";
  import { Input } from "$components/ui/input";
  import * as m from "$paraglide/messages";

  type Props = {
    form: SuperForm<T>;
    showHelper?: boolean;
  };
  let { form, showHelper }: Props = $props();

  const { form: formData } = form;

  let isPasswordFieldFocused = $state(false);
  let revealPassword = $state(false);
  let passwordInputType = $derived(revealPassword ? "text" : "password");

  const customOptions: [FirstOption<string>, ...Option<string>[]] = [
    { id: 0, value: m.validation_password_strength_tooWeak(), minDiversity: 0, minLength: 0 },
    { id: 1, value: m.validation_password_strength_weak(), minDiversity: 2, minLength: 6 },
    { id: 2, value: m.validation_password_strength_medium(), minDiversity: 3, minLength: 8 },
    { id: 3, value: m.validation_password_strength_strong(), minDiversity: 4, minLength: 10 },
  ];

  let pwd: Result<string> = $derived(passwordStrength($formData.password, customOptions));
  let myData: Array<{ name: string; isDone: boolean }> = $derived([
    { name: m.validation_password_options_longerThan({ characters: 10 }), isDone: pwd.length >= 10 },
    { name: m.validation_password_options_containsLowercases(), isDone: pwd.contains.includes("lowercase") },
    { name: m.validation_password_options_containsUppercases(), isDone: pwd.contains.includes("uppercase") },
    { name: m.validation_password_options_containsNumbers(), isDone: pwd.contains.includes("number") },
    { name: m.validation_password_options_containsSpecialCharacters(), isDone: pwd.contains.includes("symbol") },
  ]);

  const klass = showHelper ? "relative mb-2 space-y-1" : "space-y-1";
</script>

<Form.Field {form} name="password" class={klass}>
  <Form.Control let:attrs>
    <Form.Label>{m.core_form_shared_label_password()}</Form.Label>
    <Input
      {...attrs}
      type={showHelper ? passwordInputType : "password"}
      bind:value={$formData.password}
      onfocus={() => showHelper && (isPasswordFieldFocused = true)}
      onblur={() => showHelper && (isPasswordFieldFocused = false)}
    />
    {#if showHelper}
      <Button variant="ghost" class="absolute right-1 top-7 size-8 p-0" on:click={() => (revealPassword = !revealPassword)}>
        {#if passwordInputType === "text"}
          <Eye size={22} />
        {:else}
          <EyeOff size={22} />
        {/if}
      </Button>
    {/if}
    {#if isPasswordFieldFocused}
      <PasswordStrength {pwd} {myData}></PasswordStrength>
    {/if}
  </Form.Control>
  <Form.FieldErrors class="h-4 text-xs" />
</Form.Field>

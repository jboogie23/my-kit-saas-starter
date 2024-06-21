<script lang="ts">
  import type { User } from "lucia";

  import { enhance } from "$app/forms";
  import { LanguageSwitcher, Logo, ThemeSwitcher } from "$components/layout";
  import { Button } from "$components/ui/button";
  import { navLinks } from "$configs/landing/header-links";
  import { route } from "$lib/ROUTES";
  import * as m from "$paraglide/messages";

  type Props = { user: User | null };

  let { user }: Props = $props();
</script>

<header class="border-b border-gray-500 py-4 dark:border-gray-600">
  <nav class="flex justify-between">
    <Logo href={route("/")} hidden={true} />

    <ul class="hidden lg:flex lg:flex-row lg:font-medium">
      {#each navLinks as { name, href }}
        <li>
          <Button {href} variant="link" class="text-md text-black dark:text-white">
            {name}
            <span class="sr-only">{name}</span>
          </Button>
        </li>
      {/each}
    </ul>
    <div class="flex gap-2">
      <LanguageSwitcher />
      <ThemeSwitcher />
      {#if user}
        <form method="post" action={route("default /auth/logout")} use:enhance>
          <Button type="submit" variant="outline">{m.core_form_shared_label_logout()}</Button>
        </form>
        <Button href={route("/app/dashboard")}>
          {m.core_form_shared_label_dashboard()}
          <span class="sr-only">{m.core_form_shared_label_dashboard()}</span>
        </Button>
      {:else}
        <Button href={route("/auth/login")} variant="secondary">
          {m.core_form_shared_label_login()}
          <span class="sr-only">{m.core_form_shared_label_login()}</span>
        </Button>
        <Button href={route("/auth/register")}>
          {m.core_form_shared_label_register()}
          <span class="sr-only">{m.core_form_shared_label_register()}</span>
        </Button>
      {/if}
    </div>
  </nav>
</header>

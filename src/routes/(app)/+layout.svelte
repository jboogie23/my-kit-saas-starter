<script lang="ts">
  import type { User } from "lucia";
  import type { Snippet } from "svelte";

  import { Logo, ThemeSwitcher, UserDropdownMenu } from "$components/layout";
  import { Input } from "$components/ui/input";
  import { route } from "$lib/ROUTES";

  type Props = {
    children: Snippet;
    data: {
      user: User;
    };
  };

  let { children, data }: Props = $props();
  const { user } = data;
</script>

<nav class="mx-6 my-3 flex justify-between">
  <Logo href={route("/app/dashboard")} hidden={true} />

  <div class="flex gap-2">
    <Input type="search" placeholder="Search..." class="h-10 md:w-[100px] lg:w-[300px]" />

    <ThemeSwitcher />
    <UserDropdownMenu {user} />
  </div>
</nav>

<section class="flex justify-center p-2">
  {@render children()}
</section>

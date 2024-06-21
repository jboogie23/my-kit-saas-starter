<script lang="ts">
  import { LoginForm } from "$components/forms/auth";
  import { GitHub, Google } from "$components/icons";
  import { AuthCard } from "$components/layout";
  import { Button } from "$components/ui/button";
  import { route } from "$lib/ROUTES.js";
  import * as m from "$paraglide/messages";

  let { data } = $props();
</script>

<AuthCard>
  {#snippet title()}
    {m.auth_login_title()}
  {/snippet}

  {#snippet content()}
    <div class="grid grid-cols-2 gap-6">
      <Button variant="outline" href={route("GET /auth/oauth/github")}>
        <GitHub class="mr-2 h-4 w-4" />
        {m.core_form_shared_label_github()}
      </Button>
      <Button variant="outline" href={route("GET /auth/oauth/google")}>
        <Google class="mr-2 h-4 w-4" />
        {m.core_form_shared_label_google()}
      </Button>
    </div>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t"></span>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-card px-2 text-muted-foreground">
          {m.auth_login_textSeparator()}
        </span>
      </div>
    </div>
    <LoginForm {data} />
  {/snippet}

  {#snippet footer()}
    <p class="text-sm">
      {m.auth_login_footer()}
      <a href={route("/auth/register")} class="font-medium hover:underline">
        {m.core_form_shared_label_register()}
      </a>
    </p>
  {/snippet}
</AuthCard>

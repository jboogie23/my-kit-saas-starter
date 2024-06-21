<script lang="ts">
  import Bell from "lucide-svelte/icons/bell";
  import CreditCard from "lucide-svelte/icons/credit-card";
  import Settings from "lucide-svelte/icons/settings";
  import ShieldCheck from "lucide-svelte/icons/shield-check";
  import UserRound from "lucide-svelte/icons/user-round";

  import { SidebarSettingsNav } from "$components/app";
  import { Separator } from "$components/ui/separator";
  import { route } from "$lib/ROUTES";

  const sidebarNavItems = [
    {
      title: "Profile",
      href: route("/settings/profile"),
      icon: UserRound,
    },
    {
      title: "Account",
      href: route("/settings/account"),
      icon: Settings,
    },
    {
      title: "Security",
      href: route("/settings/security"),
      icon: ShieldCheck,
    },
    {
      title: "Notifications",
      href: route("/settings/notifications"),
      icon: Bell,
    },
    {
      title: "Billing",
      href: route("/settings/billing"),
      icon: CreditCard,
    },
  ];

  let { children } = $props();
</script>

<div class="container mt-8 hidden space-y-6 rounded-lg border p-10 pb-16 md:block">
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
    <p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
  </div>
  <Separator class="my-6" />
  <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
    <aside class="-mx-4 lg:w-1/5">
      <SidebarSettingsNav items={sidebarNavItems} />
    </aside>
    <div class="flex-1 lg:max-w-2xl">
      {@render children()}
    </div>
  </div>
</div>

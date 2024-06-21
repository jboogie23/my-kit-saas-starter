<script lang="ts">
  import { PricingCard } from "$components/layout";
  import { plans } from "$configs/plans";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { BillingInterval } from "$types/enums/billing-interval.enum";

  let isYearlySubscription = $state<boolean>(false);
  let billingInterval = $derived<BillingInterval>(isYearlySubscription ? BillingInterval.YEARLY : BillingInterval.MONTHLY);
</script>

<div class="mx-auto w-full max-w-screen-xl px-4 py-6 lg:px-6 lg:py-16">
  <div class="text-center font-semibold">
    <h1 class="text-5xl">
      <span class="tracking-wide text-primary">Flexible </span>
      <span>Plans</span>
    </h1>
    <p class="w-full px-8 pt-4 text-xl font-normal text-gray-400 md:w-full">Choose a plan that works best for you.</p>
    <div class="mb-6 mt-10 flex items-center justify-center gap-4">
      <Label for="billing-period">Monthly</Label>
      <Switch id="billing-period" on:click={() => (isYearlySubscription = !isYearlySubscription)} checked={isYearlySubscription} />
      <Label for="billing-period">Yearly <Badge>- 20%</Badge></Label>
    </div>
  </div>
  <div class="grid space-y-8 sm:gap-6 md:grid-cols-2 md:space-y-0 lg:grid-cols-3 xl:gap-10">
    {#each plans as plan}
      <PricingCard {plan} {billingInterval}></PricingCard>
    {/each}
  </div>
</div>

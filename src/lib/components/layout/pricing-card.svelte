<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import { fly } from "svelte/transition";

  import { enhance } from "$app/forms";
  import Button from "$components/ui/button/button.svelte";
  import * as Card from "$components/ui/card";
  import type { Plan } from "$configs/plans";
  import { route } from "$lib/ROUTES";
  import type { BillingInterval } from "$types/enums/billing-interval.enum";

  type Props = {
    plan: Plan;
    billingInterval: BillingInterval;
  };

  let { plan, billingInterval }: Props = $props();

  let price = $derived(plan[billingInterval].price);
  let priceId = $derived(plan[billingInterval].priceId);

  const { name, description, features } = plan;
</script>

<Card.Root class="max-w-96">
  <Card.Header>
    <Card.Title class="text-center text-2xl">{name}</Card.Title>
    <Card.Description class="pb-6">{description}</Card.Description>
    {#key billingInterval}
      <div class="absolute flex items-baseline justify-center pt-20" in:fly={{ y: -50, duration: 200 }} out:fly={{ y: 50, duration: 200 }}>
        <span class="mr-2 text-5xl font-extrabold">${price}</span>
        <span class="text-gray-500 dark:text-gray-400">/ {billingInterval}</span>
      </div>
    {/key}
  </Card.Header>
  <Card.Content>
    <hr class="border-1 mt-12" />
    <ul role="list" class="my-6 space-y-4 text-left">
      {#each features as feature}
        <li class="flex items-center space-x-3">
          <Check color="green" />
          <span>{feature}</span>
        </li>
      {/each}
    </ul>
  </Card.Content>
  <Card.Footer>
    <form method="post" action={route("subscribe /order")} use:enhance>
      <input type="hidden" name="priceId" value={priceId} />
      <Button type="submit">Subscribe</Button>
    </form>
  </Card.Footer>
</Card.Root>

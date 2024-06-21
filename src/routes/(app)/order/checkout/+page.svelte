<script lang="ts">
  import { loadStripe, type Stripe } from "@stripe/stripe-js";

  import { goto } from "$app/navigation";
  import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  import { route } from "$lib/ROUTES.js";

  let { data } = $props();

  let stripe: Stripe | null = $state(null);

  $effect(() => {
    // ugly workaround because of https://github.com/sveltejs/svelte/issues/9520
    (async () => {
      stripe = await loadStripe(PUBLIC_STRIPE_KEY);

      const { clientSecret } = data;

      if (stripe && clientSecret) {
        const checkout = await stripe.initEmbeddedCheckout({ clientSecret });

        if (checkout) {
          checkout.mount("#checkout");
          return;
        }
      }

      goto(route("/order/error"));
    })();
  });
</script>

<div class="flex min-h-screen items-center justify-center py-12">
  <div class="rounded-lg bg-secondary bg-opacity-40 p-8 shadow-xl">
    <div id="checkout"></div>
  </div>
</div>

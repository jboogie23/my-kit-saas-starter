export type PlanPrice = {
  price: string;
  priceId: string;
};

export type Plan = {
  name: string;
  description: string;
  monthly: PlanPrice;
  yearly: PlanPrice;
  features: string[];
};

// TODO fetch these plans from stripe
export const plans: Plan[] = [
  {
    name: "Starter",
    description: "Start from here",
    monthly: {
      price: "4.99",
      priceId: "price_1PG3oFP1SqvRVvhroN7yTrXB",
    },
    yearly: {
      price: "49.99",
      priceId: "price_1PG3oFP1SqvRVvhrfwQKFOtc",
    },
    features: ["Feature #1", "Feature #2", "Feature #3"],
  },
  {
    name: "Standard",
    description: "Good balance",
    monthly: {
      price: "14.99",
      priceId: "price_1PG3oFP1SqvRVvhroN7yTrXB",
    },
    yearly: {
      price: "149.99",
      priceId: "price_1PG3oFP1SqvRVvhrfwQKFOtc",
    },
    features: ["All in Starter plan plus", "Feature #4", "Feature #5"],
  },
  {
    name: "Premium",
    description: "If you want everything",
    monthly: {
      price: "49.99",
      priceId: "price_1PG3oFP1SqvRVvhroN7yTrXB",
    },
    yearly: {
      price: "499.99",
      priceId: "price_1PG3oFP1SqvRVvhrfwQKFOtc",
    },
    features: ["All in Standard plan plus", "Feature #6", "Feature #7"],
  },
];

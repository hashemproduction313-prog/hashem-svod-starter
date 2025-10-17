// src/data/plans.ts
export type PlanId = "ad" | "standard" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;   // affichage
  priceId: string; // Stripe price_xxx
};

// Priorité aux clés serveur (STRIPE_*), sinon NEXT_PUBLIC_*
const ENV_PRICE_AD =
  process.env.STRIPE_PRICE_STANDARD_ADS ||
  process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD_ADS ||
  "";

const ENV_PRICE_STANDARD =
  process.env.STRIPE_PRICE_STANDARD ||
  process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD ||
  "";

const ENV_PRICE_PREMIUM =
  process.env.STRIPE_PRICE_PREMIUM ||
  process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM ||
  "";

export const PLANS: Record<PlanId, Plan> = {
  ad: {
    id: "ad",
    name: "Standard avec Pub",
    price: "7,99 € / mois",
    priceId: ENV_PRICE_AD || "price_1SItgo2fDeTmjRl7ALkhlBzI",
  },
  standard: {
    id: "standard",
    name: "Standard",
    price: "14,99 € / mois",
    priceId: ENV_PRICE_STANDARD || "price_1SItmG2fDeTmjRl7qEKz7Ezd",
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: "21,99 € / mois",
    priceId: ENV_PRICE_PREMIUM || "price_1SItoC2fDeTmjRl71w0Ld5jn",
  },
};

export function normalizePlanId(v: any): PlanId {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "ad" || s === "standard" || s === "premium") return s;
  return "ad";
}

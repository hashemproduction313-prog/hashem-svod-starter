// src/data/plans.ts
// ✅ Version sans Stripe (aucune variable d'environnement requise)

export type PlanId = "ad" | "standard" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;   // affichage uniquement
  priceId: string; // conservé pour compatibilité, vide car pas de Stripe
};

export const PLANS: Record<PlanId, Plan> = {
  ad: {
    id: "ad",
    name: "Standard avec Pub",
    price: "7,99 € / mois",
    priceId: "", // pas de Stripe
  },
  standard: {
    id: "standard",
    name: "Standard",
    price: "14,99 € / mois",
    priceId: "", // pas de Stripe
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: "21,99 € / mois",
    priceId: "", // pas de Stripe
  },
} as const;

/** Normalise un id de plan arbitraire en valeur valide. */
export function normalizePlanId(v: unknown): PlanId {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "ad" || s === "standard" || s === "premium") return s;
  return "ad";
}

/** Liste pratique (ordre d’affichage). */
export const PLAN_LIST: Plan[] = [PLANS.ad, PLANS.standard, PLANS.premium];

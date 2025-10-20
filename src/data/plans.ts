// src/data/plans.ts
export type PlanId = "ad" | "standard" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;   // affichage
  priceId: string; // Stripe price_xxx
};

// ⚠️ On lit UNIQUEMENT les clés serveur STRIPE_* (pas de NEXT_PUBLIC_* ici)
const ENV_PRICE_AD        = process.env.STRIPE_PRICE_STANDARD_ADS || "";
const ENV_PRICE_STANDARD  = process.env.STRIPE_PRICE_STANDARD     || "";
const ENV_PRICE_PREMIUM   = process.env.STRIPE_PRICE_PREMIUM      || "";

// ✅ Fallbacks EXACTS (avec “Stt…”, deux t, pas de I)
const FALLBACK_AD        = "price_1Sttgo2fDeTmjRl7ALkhlBzI"; // 7,99 — Standard avec pub
const FALLBACK_STANDARD  = "price_1SttmG2fDeTmjRl7QEkZ7EZd"; // 14,99 — Standard
const FALLBACK_PREMIUM   = "price_1SttoC2fDeTmjRl71w0Ld5jn"; // 21,99 — Premium

export const PLANS: Record<PlanId, Plan> = {
  ad: {
    id: "ad",
    name: "Standard avec Pub",
    price: "7,99 € / mois",
    priceId: ENV_PRICE_AD || FALLBACK_AD,
  },
  standard: {
    id: "standard",
    name: "Standard",
    price: "14,99 € / mois",
    priceId: ENV_PRICE_STANDARD || FALLBACK_STANDARD,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: "21,99 € / mois",
    priceId: ENV_PRICE_PREMIUM || FALLBACK_PREMIUM,
  },
};

export function normalizePlanId(v: any): PlanId {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "ad" || s === "standard" || s === "premium") return s;
  return "ad";
}

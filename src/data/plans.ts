// src/data/plans.ts

export type PlanId = "ad" | "std" | "prem";

export type PlanMeta = {
  id: PlanId;
  name: string;
  badge: string;   // ex: "1080p", "4K + HDR"
  price: string;   // ex: "14,99 € / mois"
};

export const PLANS: Record<PlanId, PlanMeta> = {
  ad: {
    id: "ad",
    name: "Standard avec pub",
    badge: "1080p",
    price: "7,99 € / mois",
  },
  std: {
    id: "std",
    name: "Standard",
    badge: "1080p",
    price: "14,99 € / mois",
  },
  prem: {
    id: "prem",
    name: "Premium",
    badge: "4K + HDR",
    price: "21,99 € / mois",
  },
};

// ✅ unique, pas de doublon, pas de default export
export function normalizePlanId(q?: string | null): PlanId {
  const v = (q ?? "").trim().toLowerCase();
  if (v === "ad" || v === "std" || v === "prem") return v;
  return "std"; // valeur par défaut
}

// (optionnel) pour afficher un libellé complet si besoin
export function planFullLabel(id: PlanId): string {
  const p = PLANS[id];
  return `${p.name} (${p.badge})`;
}

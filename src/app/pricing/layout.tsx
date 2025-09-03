// src/app/pricing/layout.tsx
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tarifs · Hashem SVOD" };

export default function PricingLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}

// Marque le fichier comme module pour TypeScript, même s'il tree-shake tout
export {};

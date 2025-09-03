// src/app/subscribe/layout.tsx
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Abonnements · Hashem SVOD" };

// Empêche le prérendu de casser pendant le build
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ✅ Default export OBLIGATOIRE pour que ce soit "un module"
export default function SubscribeLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}

// Forcer TypeScript à considérer ce fichier comme module dans tous les cas
export {};

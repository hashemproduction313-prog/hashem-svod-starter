// src/app/auth/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion – Hashem SVOD",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

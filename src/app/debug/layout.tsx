import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Titre de la section" };

export default function SectionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

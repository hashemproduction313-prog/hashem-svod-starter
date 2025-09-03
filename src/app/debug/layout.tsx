// src/app/debug/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debug · Hashem SVOD",
};

export default function DebugLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

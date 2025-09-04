import { Suspense } from "react";

export const dynamic = "force-dynamic"; // pas de pre-render
export const revalidate = 0;            // pas de cache SSG
export const runtime = "nodejs";        // pour Render / Node

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Le fallback peut être ton loader si tu en as un
  return <Suspense fallback={null}>{children}</Suspense>;
}

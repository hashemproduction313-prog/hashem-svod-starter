// src/app/watch/[id]/page.tsx
import { redirect, notFound } from "next/navigation";
import { catalog } from "@/data/catalog";

export default function WatchRedirectPage({ params }: { params: { id: string } }) {
  const seriesId = Number(params.id);
  if (!Number.isFinite(seriesId)) return notFound();

  const series = catalog.find((s) => s.id === seriesId);
  if (!series || !series.episodes.length) return notFound();

  redirect(`/watch/${seriesId}/1`);
}

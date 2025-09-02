// src/app/watch/[id]/[episode]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@/data/catalog";

type RouteParams = { id: string; episode: string };

export default function WatchEpisodePage({ params }: { params: RouteParams }) {
  // 1) ID série
  const seriesId = Number(params.id);
  if (!Number.isFinite(seriesId)) return notFound();

  const series = catalog.find((s) => s.id === seriesId);
  if (!series) return notFound();

  // 2) Episode param: "3" ou "inedit-2"
  const epParam = params.episode ?? "";
  if (!epParam) return notFound();

  const isInedit = epParam.startsWith("inedit-");
  const numStr = isInedit ? epParam.slice("inedit-".length) : epParam;

  const epNum = Number(numStr);
  if (!Number.isFinite(epNum)) return notFound();

  const list = isInedit ? series.inedits ?? [] : series.episodes;
  const ep = list.find((e) => e.num === epNum);
  if (!ep) return notFound();

  const fullTitle = isInedit
    ? `${series.title} — Inédit ${ep.num} : ${ep.title}`
    : `${series.title} — Épisode ${ep.num} : ${ep.title}`;

  return (
    <main className="container" style={{ maxWidth: 1100 }}>
      {/* Fil d’ariane */}
      <nav className="breadcrumb" aria-label="Fil d’ariane">
        <Link href={`/title/${series.id}`} className="back-link">◀ {series.title}</Link>
      </nav>

      <h1 className="watch-title">{fullTitle}</h1>

      {/* Lecteur vidéo */}
      <div className="player-wrap">
        <video
          src={ep.video}
          controls
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </main>
  );
}

// src/app/watch/[id]/[ep]/page.tsx
import { notFound } from "next/navigation";
import { catalog } from "@/data/catalog";

type Params = { id: string; ep: string };

export default function WatchEpisodePage({ params }: { params: Params }) {
  const seriesId = Number(params.id);
  if (!Number.isFinite(seriesId)) return notFound();

  const series = catalog.find((s) => s.id === seriesId);
  if (!series) return notFound();

  // ep peut être "3" ou "inedit-2"
  const epParam = params.ep;
  const isInedit = epParam.startsWith("inedit-");
  const epNum = isInedit ? Number(epParam.replace("inedit-", "")) : Number(epParam);
  if (!Number.isFinite(epNum)) return notFound();

  const list = isInedit ? series.inedits ?? [] : series.episodes;
  const ep = list.find((e) => e.num === epNum);
  if (!ep) return notFound();

  const fullTitle = isInedit
    ? `${series.title} — Inédit ${ep.num} : ${ep.title}`
    : `${series.title} — Épisode ${ep.num} : ${ep.title}`;

  return (
    <main className="container" style={{ maxWidth: 1100 }}>
      {/* Fil d’ariane simple */}
      <nav className="breadcrumb" aria-label="Fil d’ariane">
        <a href={`/title/${series.id}`} className="back-link">◀ {series.title}</a>
      </nav>

      <h1 className="watch-title">{fullTitle}</h1>

      {/* Lecteur vidéo (aucun résumé ici) */}
      <div className="player-wrap">
        <video
          src={ep.video}
          controls
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <style jsx>{`
        .watch-title {
          font-size: clamp(20px, 3.2vw, 34px);
          font-weight: 900;
          margin: 8px 0 14px;
        }
        .breadcrumb {
          margin: 6px 0 8px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--line, #1f1f22);
          text-decoration: none;
        }
        .back-link:hover {
          text-decoration: none;
          border-color: #2b2b2f;
        }
      `}</style>
    </main>
  );
}

// src/app/title/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { catalog } from "../../../data/catalog";

export default function TitlePage({ params }: { params: { id: string } }) {
  // 1) ID robuste
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const seriesId = Number.parseInt(rawId as string, 10);
  if (!Number.isFinite(seriesId)) return notFound();

  // 2) Chercher la série
  const series = catalog.find((s) => s.id === seriesId);
  if (!series) return notFound();

  const hasInedits = !!series.inedits?.length;

  return (
    <main className="container">
      {/* HERO */}
      <section className="title-hero">
        <div className="title-hero__poster">
          <Image
            src={series.poster}
            alt={series.title}
            width={540}
            height={304}
            priority
          />
        </div>
        <div className="title-hero__content">
          <h1 className="title-hero__title">{series.title}</h1>
          <p className="title-hero__desc">{series.description}</p>

          {series.episodes?.length ? (
            <Link className="btn-primary" href={`/watch/${series.id}/1`}>
              ▶ Lire l’épisode 1
            </Link>
          ) : null}
        </div>
      </section>

      {/* LISTE D'ÉPISODES (thumb à gauche, infos à droite) */}
      <section className="row">
        <h2>Épisodes</h2>
        <div className="episode-list">
          {series.episodes.map((e) => (
            <Link
              key={e.num}
              href={`/watch/${series.id}/${e.num}`}
              className="episode-row"
            >
              <div className="thumb">
                <Image
                  src={e.thumb}
                  alt={`Épisode ${e.num} — ${e.title}`}
                  fill
                  sizes="(max-width: 800px) 100vw, 320px"
                  style={{ objectFit: "cover" }}
                  priority={e.num <= 2}
                />
              </div>
              <div className="info">
                <h3 className="title">{`Épisode ${e.num} — ${e.title}`}</h3>
                <p className="synopsis">{e.synopsis}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INÉDITS (si présents) */}
      {hasInedits && (
        <section className="row">
          <h2>Épisodes Inédits — Le Manifeste du Mahdi</h2>
          <div className="episode-list">
            {series.inedits!.map((e) => (
              <Link
                key={`inedit-${e.num}`}
                href={`/watch/${series.id}/inedit-${e.num}`}
                className="episode-row"
              >
                <div className="thumb">
                  <Image
                    src={e.thumb || series.poster}
                    alt={`Inédit ${e.num} — ${e.title}`}
                    fill
                    sizes="(max-width: 800px) 100vw, 320px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="info">
                  <h3 className="title">{`Inédit ${e.num} — ${e.title}`}</h3>
                  {e.synopsis ? <p className="synopsis">{e.synopsis}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

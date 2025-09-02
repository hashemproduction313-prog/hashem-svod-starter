// src/app/watch/[id]/WatchClient.tsx
"use client";

import Link from "next/link";
import React from "react";

type Props = {
  seriesId: number;
  seriesTitle: string;
  fullTitle: string;
  videoSrc: string;
  synopsis: string;
  isPremium: boolean;
};

export default function WatchClient({
  seriesId,
  seriesTitle,
  fullTitle,
  videoSrc,
  synopsis,
  isPremium,
}: Props) {
  return (
    <main className="container" style={{ maxWidth: 1100 }}>
      {/* Fil d’ariane */}
      <nav className="breadcrumb" aria-label="Fil d’ariane">
        <Link href={`/title/${seriesId}`} className="back-link">
          ◀ {seriesTitle}
        </Link>
      </nav>

      <h1 className="watch-title">{fullTitle}</h1>

      {/* PAYWALL Premium */}
      {isPremium ? (
        <div
          className="glass-panel"
          style={{
            display: "grid",
            gap: 12,
            placeItems: "center",
            padding: 28,
            marginTop: 8,
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 800 }}>Contenu Premium 🔒</p>
          <p style={{ color: "var(--muted)", textAlign: "center", maxWidth: 560 }}>
            Cet épisode est réservé aux abonnés. Abonnez-vous pour débloquer
            tous les épisodes Premium.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/subscribe" className="btn-cta">
              S’abonner
            </Link>
            <Link href={`/title/${seriesId}`} className="btn-ghost-secondary">
              Voir les épisodes gratuits
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Lecteur vidéo FREE */}
          <div className="player-wrap" style={{ marginTop: 8 }}>
            <video
              src={videoSrc}
              controls
              playsInline
              preload="metadata"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {synopsis ? (
            <p className="mt" style={{ color: "var(--muted)" }}>
              {synopsis}
            </p>
          ) : null}
        </>
      )}

      {/* styled-jsx (si tu en as besoin ici) */}
      <style jsx>{`
        .watch-title {
          margin-top: 8px;
        }
      `}</style>
    </main>
  );
}

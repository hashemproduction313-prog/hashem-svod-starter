// src/app/watch/[id]/WatchClient.tsx
"use client";

import React from "react";

type Props = {
  seriesId: number;
  episodeNumber: number;
  // Ajoute d'autres props dont ton UI a besoin (titre, url vidéo, etc.)
};

export default function WatchClient({ seriesId, episodeNumber }: Props) {
  // 👉 Mets ici ton code “client only” :
  // - hooks (useEffect/useState)
  // - lecteur vidéo
  // - styled-jsx
  // - accès à window/document
  // - etc.

  return (
    <div>
      {/* Exemple minimal : remplace ce bloc par ton UI réelle */}
      <h1>Lecture série #{seriesId} — épisode {episodeNumber}</h1>

      {/* Déplace ton styled-jsx ici */}
      <style jsx>{`
        /* Ton styled-jsx ici */
      `}</style>
    </div>
  );
}

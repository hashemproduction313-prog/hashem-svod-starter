// src/data/catalog.ts

export type Ep = {
  num: number;        // numéro d’épisode
  title: string;      // titre affiché
  video: string;      // ex: "/videos/video9-1.mp4"  <-- SANS UNDERSCORE
  thumb: string;      // ex: "/thumbs/thumbs_9-1.jpg"
  synopsis: string;   // résumé court
  duration?: string;  // optionnel
};

export type Series = {
  id: number;             // 9 = "Le Lever"
  type: "series";
  title: string;
  poster: string;         // ex: "/posters/poster9.jpg"
  year: number;
  category: string;       // "Série"
  description: string;
  episodes: Ep[];
  inedits?: Ep[];
};

export const catalog: Series[] = [
  {
    id: 9,
    type: "series",
    title: "Le Lever",
    poster: "/posters/poster9.jpg",
    year: 2024,
    category: "Série",
    description:
      "Une aube nouvelle, symbole d’un renouveau intérieur. Suivez la série épisode par épisode.",
    episodes: [
      { num: 1,  title: "Le salut dans les religions",
        video: "/videos/video9-1.mp4",  thumb: "/thumbs/thumbs_9-1.jpg",
        synopsis: "Présenté par Johnattan, Rémi et Mirza Aal Almahdi, cet épisode..." },
      { num: 2,  title: "La Religion de tous les Prophètes",
        video: "/videos/video9-2.mp4",  thumb: "/thumbs/thumbs_9-2.jpg",
        synopsis: "La vraie religion dépasse les rituels..." },
      { num: 3,  title: "Comment reconnaître l’imam al-Mahdi (de Lui est la Paix)",
        video: "/videos/video9-3.mp4",  thumb: "/thumbs/thumbs_9-3.jpg",
        synopsis: "Si Allah est juste, Il n’a pas laissé..." },
      { num: 4,  title: "Les signes de la fin des temps",
        video: "/videos/video9-4.mp4",  thumb: "/thumbs/thumbs_9-4.jpg",
        synopsis: "L’époque messianique annoncée se dévoile..." },
      { num: 5,  title: "Le jour du Jugement",
        video: "/videos/video9-5.mp4",  thumb: "/thumbs/thumbs_9-5.jpg",
        synopsis: "Le Jour du Jugement n’est pas seulement futur..." },
      { num: 6,  title: "L’épreuve de l’Antéchrist Dajjal",
        video: "/videos/video9-6.mp4",  thumb: "/thumbs/thumbs_9-6.jpg",
        synopsis: "Le Dajjal est plus qu’un individu..." },
      { num: 7,  title: "Réaction aux cheikhs de Najaf",
        video: "/videos/video9-7.mp4",  thumb: "/thumbs/thumbs_9-7.jpg",
        synopsis: "« Si le Mahdi sort par Allah, nous le combattrons. » ..." },
      { num: 8,  title: "Les ennemis jurés du Mahdi",
        video: "/videos/video9-8.mp4",  thumb: "/thumbs/thumbs_9-8.jpg",
        synopsis: "Les plus grands ennemis du Mahdi..." },
      { num: 9,  title: "L’imam al-Mahdi est apparu",
        video: "/videos/video9-9.mp4",  thumb: "/thumbs/thumbs_9-9.jpg",
        synopsis: "Le 23 janvier 2015, jour de la mort du roi Abdullah..." },
      { num: 10, title: "Ahmed Al Hassan, le Yamani promis",
        video: "/videos/video9-10.mp4", thumb: "/thumbs/thumbs_9-10.jpg",
        synopsis: "L’apparition du Yamani est un signe inévitable..." },
      { num: 11, title: "Qui est Abdullah Hashem ?",
        video: "/videos/video9-11.mp4", thumb: "/thumbs/thumbs_9-11.jpg",
        synopsis: "Présentation d’Abdullah Hashem Aba Al-Sadiq..." },
      { num: 12, title: "Abdullah Hashem, le Qa’im",
        video: "/videos/video9-12.mp4", thumb: "/thumbs/thumbs_9-12.jpg",
        synopsis: "Abdullah Hashem Aba Al-Sadiq se lève comme le Qa’im..." },
      { num: 13, title: "Le Jardin d’Eden",
        video: "/videos/video9-13.mp4", thumb: "/thumbs/thumbs_9-13.jpg",
        synopsis: "Que s’est-il réellement passé au Jardin d’Eden ? ..." },
      { num: 14, title: "La Gouvernance de Satan",
        video: "/videos/video9-14.mp4", thumb: "/thumbs/thumbs_9-14.jpg",
        synopsis: "Depuis Caïn, la descendance d’Iblis combat la lumière..." },
      { num: 15, title: "Les compagnons du Mahdi",
        video: "/videos/video9-15.mp4", thumb: "/thumbs/thumbs_9-15.jpg",
        synopsis: "Qui sont les compagnons du Mahdi ? ..." },
      { num: 16, title: "Pourquoi Allah permet la souffrance ?",
        video: "/videos/video9-16.mp4", thumb: "/thumbs/thumbs_9-16.jpg",
        synopsis: "Pourquoi Allah permet-Il la souffrance ? ..." },
      { num: 17, title: "Les degrés du croyant",
        video: "/videos/video9-17.mp4", thumb: "/thumbs/thumbs_9-17.jpg",
        synopsis: "Le croyant progresse par degrés..." },
      { num: 18, title: "La première création d’Allah : Mohammed",
        video: "/videos/video9-18.mp4", thumb: "/thumbs/thumbs_9-18.jpg",
        synopsis: "Le Prophète Mohammed est lumière première..." },
      { num: 19, title: "Seul Allah est Lumière sans ténèbres",
        video: "/videos/video9-19.mp4", thumb: "/thumbs/thumbs_9-19.jpg",
        synopsis: "Ce monde imparfait reflète la limite des créatures..." },
      { num: 20, title: "La plus grande idole : l’Ego",
        video: "/videos/video9-20.mp4", thumb: "/thumbs/thumbs_9-20.jpg",
        synopsis: "Le Prophète enseigna le grand combat contre soi..." },
      { num: 21, title: "Ils t’interrogent au sujet de l’Âme",
        video: "/videos/video9-21.mp4", thumb: "/thumbs/thumbs_9-21.jpg",
        synopsis: "Inspiré par Aba Al-Sadiq, l’épisode explore l’âme..." },
      { num: 22, title: "Rajaa : retour des âmes",
        video: "/videos/video9-22.mp4", thumb: "/thumbs/thumbs_9-22.jpg",
        synopsis: "Le Rajaa, retour des âmes, est un enseignement..." },
      { num: 23, title: "L’Enfer est-il réel ?",
        video: "/videos/video9-23.mp4", thumb: "/thumbs/thumbs_9-23.jpg",
        synopsis: "À la lumière de l’enseignement du Qaim Aba Al-Sadiq..." },
      { num: 24, title: "La porte de la Cité de toutes les sciences",
        video: "/videos/video9-24.mp4", thumb: "/thumbs/thumbs_9-24.jpg",
        synopsis: "« Entrez dans cette Cité… » (Coran 2:58) ..." }
    ]
  }
];

export function getSeries(id: number): Series | undefined {
  return catalog.find((s) => s.id === id);
}

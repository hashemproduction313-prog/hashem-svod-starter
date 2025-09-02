// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";

type Access = "free" | "premium";

const allPosters: { id: number; title: string; poster: string; access: Access }[] = [
  { id: 1,  title: "La 7ème Alliance",              poster: "/posters/poster1.jpg",  access: "premium" },
  { id: 2,  title: "Manga",                         poster: "/posters/poster2.jpg",  access: "premium" },
  { id: 3,  title: "Court-Métrage",                 poster: "/posters/poster3.jpg",  access: "premium" },

  { id: 4,  title: "Musique",                       poster: "/posters/poster4.jpg",  access: "free"    },
  { id: 5,  title: "Sermon",                        poster: "/posters/poster5.jpg",  access: "free"    },
  { id: 6,  title: "Documentaire",                  poster: "/posters/poster6.jpg",  access: "free"    },

  { id: 7,  title: "Kids",                          poster: "/posters/poster7.jpg",  access: "premium" },

  { id: 8,  title: "Les Apôtres de l'Esprit Saint", poster: "/posters/poster8.jpg",  access: "free"    },
  { id: 9,  title: "Le Lever",                      poster: "/posters/poster9.jpg",  access: "free"    },
  { id: 10, title: "C'est l'Heure",                 poster: "/posters/poster10.jpg", access: "free"    },
  { id: 11, title: "Dieu t'Appelle",                poster: "/posters/poster11.jpg", access: "free"    },
  { id: 12, title: "Enseignements Divin",           poster: "/posters/poster12.jpg", access: "free"    },
];

const nouveautes = allPosters.slice(0, 6);
const aLaUne    = allPosters.slice(6, 12);

function linkFor(id: number) {
  return `/title/${id}`;
}

function Card({ v }: { v: { id: number; title: string; poster: string; access: Access } }) {
  const isPremium = v.access === "premium";

  return (
    <Link href={linkFor(v.id)} className="card-modern card-link" aria-label={v.title} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Image
          src={v.poster}
          alt={v.title}
          width={320}
          height={180}
          sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 16vw"
          priority={v.id <= 3}
        />

        {/* Badge en haut à gauche */}
        <span
          className={`badge ${isPremium ? "badge--premium" : "badge--free"}`}
          aria-label={isPremium ? "Premium" : "Gratuit"}
        >
          {isPremium ? "Premium 🔒" : "Gratuit"}
        </span>
      </div>

      <h3>{v.title}</h3>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Plateforme de Streaming Spirituel</h1>
          <p>
            Un espace dédié aux âmes en quête de lumière : animations, films,
            documentaires, séries sacrées, chroniques des Ansars et vidéos
            d’Aba Al-Sadiq (De Lui est la Paix).
          </p>
          <Link className="btn-primary" href="/subscribe">Abonnez-vous</Link>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="row">
        <h2>Nouveautés</h2>
        <div className="grid">
          {nouveautes.map((v) => <Card key={v.id} v={v} />)}
        </div>
      </section>

      {/* À la une */}
      <section className="row">
        <h2>À la une</h2>
        <div className="grid">
          {aLaUne.map((v) => <Card key={v.id} v={v} />)}
        </div>
      </section>
    </>
  );
}

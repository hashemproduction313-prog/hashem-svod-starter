# Hashem SVOD — Starter (Next.js + Supabase + Stripe + Mux)

> MVP de plateforme de streaming façon Netflix. Front Next.js (App Router), Auth Supabase, Paiements Stripe, Player Mux.

## Prérequis
- Node.js LTS (>=18) et npm (ou pnpm)
- Git
- Un éditeur (VS Code)

## 1) Cloner et installer
```bash
npm install
# ou: pnpm install
cp .env.local.example .env.local
```

## 2) Configurer les services
### Supabase
1. Crée un projet (région EU si possible).
2. Récupère `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` et colle-les dans `.env.local`.
3. Dans Supabase SQL, crée les tables de base (voir script en bas).

### Stripe
1. Active le **Test mode**.
2. Crée 2 **Prices** (mensuel, annuel) et colle leurs IDs dans `.env.local` (`STRIPE_PRICE_*`).
3. Utilise le Stripe CLI pour les webhooks :
   ```bash
   stripe login
   stripe listen --forward-to http://localhost:3000/api/stripe-webhook
   ```
   Copie le `webhook signing secret` dans `STRIPE_WEBHOOK_SECRET`.

### Mux
1. Crée un Access Token (Read/Write).
2. Uploade une vidéo depuis le dashboard, puis copie le **Playback ID** (dev: public).
3. En dev, visite `/watch/TON_PLAYBACK_ID` pour lire la vidéo.
   (En prod, utilise des **playback IDs signés** + DRM selon besoin.)

## 3) Lancer
```bash
npm run dev
# http://localhost:3000
```

## 4) Pages
- `/` : Accueil + carrousels statiques (exemple)
- `/pricing` : Abonnement (boutons Checkout)
- `/account` : Espace compte (placeholder)
- `/watch/[id]` : Player Mux (id = Playback ID)

## 5) Script SQL (tables simples)
> Colle ça dans Supabase > SQL editor

```sql
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  synopsis text,
  poster_url text,
  playback_id text not null, -- Mux playback id
  created_at timestamp with time zone default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null
);

create table if not exists public.collection_items (
  collection_id uuid references public.collections(id) on delete cascade,
  video_id uuid references public.videos(id) on delete cascade,
  position int default 0,
  primary key (collection_id, video_id)
);

-- RLS simple (lecture publique catalog), écriture réservée (à désactiver en dev si besoin)
alter table public.videos enable row level security;
create policy "read videos" on public.videos for select using (true);

alter table public.collections enable row level security;
create policy "read collections" on public.collections for select using (true);

alter table public.collection_items enable row level security;
create policy "read items" on public.collection_items for select using (true);
```

## 6) Sécurité
- En dev, un playback ID public suffit.
- En prod, ajoute une route server pour générer des **URLs signées** Mux, et vérifie l'abonnement Stripe côté serveur avant d'autoriser la lecture.

Bon build ! ✨

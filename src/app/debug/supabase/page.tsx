// src/app/debug/supabase/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SupabaseDebugPage() {
  const urlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonSet = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceSet = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Supabase — debug</h1>
      <p className="text-sm text-gray-500 mt-2">
        (Cette page ne jette plus d’erreur pendant le build)
      </p>

      <ul className="mt-4 space-y-2">
        <li>
          NEXT_PUBLIC_SUPABASE_URL : <b>{urlSet ? "définie" : "manquante"}</b>
        </li>
        <li>
          NEXT_PUBLIC_SUPABASE_ANON_KEY : <b>{anonSet ? "définie" : "manquante"}</b>
        </li>
        <li>
          SUPABASE_SERVICE_ROLE_KEY : <b>{serviceSet ? "définie" : "manquante"}</b>
        </li>
      </ul>
    </main>
  );
}

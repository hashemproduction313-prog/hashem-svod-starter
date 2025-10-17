import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (id) {
      // Vérifie un price précis
      const price = await stripe.prices.retrieve(id);
      return NextResponse.json({ ok: true, mode: "retrieve", price });
    }
    // Liste rapide (pour voir au moins 5 prices visibles par la clé)
    const list = await stripe.prices.list({ limit: 10 });
    return NextResponse.json({ ok: true, mode: "list", count: list.data.length, ids: list.data.map(p => p.id) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 400 });
  }
}

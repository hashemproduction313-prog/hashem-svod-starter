import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sk = process.env.STRIPE_SECRET_KEY || "";
    if (!sk) return NextResponse.json({ ok:false, error:"Missing STRIPE_SECRET_KEY" }, { status:500 });

    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) return NextResponse.json({ ok:false, error:"Missing ?id=price_xxx" }, { status:400 });

    const stripe = new Stripe(sk, { apiVersion: "2023-10-16" });
    const price = await stripe.prices.retrieve(id);

    return NextResponse.json({
      ok: true,
      price: {
        id: price.id,
        active: price.active,
        currency: price.currency,
        unit_amount: price.unit_amount,
        product: price.product
      }
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || String(e) }, { status:400 });
  }
}

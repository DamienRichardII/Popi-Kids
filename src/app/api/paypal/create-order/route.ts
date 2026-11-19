import { NextResponse } from "next/server";
import { priceOrder } from "@/lib/order";
import { createOrder, paypalConfigured } from "@/lib/paypal";

export async function POST(req: Request) {
  if (!paypalConfigured()) return NextResponse.json({ error: "Paiement PayPal non configuré." }, { status: 503 });
  try {
    const body = await req.json();
    const priced = await priceOrder(body?.lines);
    const ref = `POPI-${Date.now().toString(36).toUpperCase()}`;
    const { id } = await createOrder(priced, ref);
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur de paiement." }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { captureOrder, paypalConfigured } from "@/lib/paypal";

export async function POST(req: Request) {
  if (!paypalConfigured()) return NextResponse.json({ error: "Paiement PayPal non configuré." }, { status: 503 });
  try {
    const body = await req.json();
    return NextResponse.json(await captureOrder(String(body?.orderID ?? "")));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur de paiement." }, { status: 400 });
  }
}

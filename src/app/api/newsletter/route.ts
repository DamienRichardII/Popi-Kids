import { NextResponse } from "next/server";

/** Inscription non branchée (Resend/Audience à configurer en phase 2) : aucun e-mail n'est stocké. */
export async function POST(req: Request) {
  const email = String((await req.formData()).get("email") ?? "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "E-mail invalide" }, { status: 400 });
  return NextResponse.json({ status: "not_configured" }, { status: 501 });
}

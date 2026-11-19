import type { PricedOrder } from "./order";

/** Serveur uniquement. Clés lues dans les variables d'environnement (jamais dans le code). Sandbox par défaut : PAYPAL_ENV=live pour la production. */
const live = () => (process.env.PAYPAL_ENV ?? "").trim() === "live";
const BASE = () => (live() ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");
export const paypalConfigured = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
export const paypalEnv = () => (live() ? "live" : "sandbox");

const eur = (cents: number) => (cents / 100).toFixed(2);

async function token(): Promise<string> {
  const auth = Buffer.from(`${(process.env.PAYPAL_CLIENT_ID ?? "").trim()}:${(process.env.PAYPAL_CLIENT_SECRET ?? "").trim()}`).toString("base64");
  const r = await fetch(`${BASE()}/v1/oauth2/token`, { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials", cache: "no-store" });
  if (!r.ok) {
    // Diagnostic serveur (Vercel > Logs) : jamais de clé dans le message.
    const d = await r.json().catch(() => ({}));
    console.error("[paypal] auth refusée", { http: r.status, env: paypalEnv(), error: d.error, description: d.error_description, idLen: (process.env.PAYPAL_CLIENT_ID ?? "").length, secretLen: (process.env.PAYPAL_CLIENT_SECRET ?? "").length });
    throw new Error("PayPal : authentification refusée.");
  }
  return (await r.json()).access_token as string;
}

/** Corps de commande PayPal (Orders v2) : montants en EUR, détail des lignes, remise et livraison. */
export function buildOrder(o: PricedOrder, ref: string) {
  const amount: Record<string, unknown> = {
    currency_code: "EUR", value: eur(o.total),
    breakdown: {
      item_total: { currency_code: "EUR", value: eur(o.itemTotal) },
      shipping: { currency_code: "EUR", value: eur(o.shipping) },
      discount: { currency_code: "EUR", value: eur(o.discount) },
    },
  };
  return {
    intent: "CAPTURE",
    purchase_units: [{
      reference_id: "popikids", custom_id: ref, description: "Commande POPI KIDS", amount,
      items: o.items.map((i) => ({ name: i.name, description: i.description || undefined, sku: i.sku, quantity: String(i.qty), unit_amount: { currency_code: "EUR", value: eur(i.unit) }, category: "PHYSICAL_GOODS" })),
    }],
  };
}

export async function createOrder(o: PricedOrder, ref: string): Promise<{ id: string }> {
  const r = await fetch(`${BASE()}/v2/checkout/orders`, { method: "POST", cache: "no-store",
    headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json", "PayPal-Request-Id": ref }, body: JSON.stringify(buildOrder(o, ref)) });
  if (!r.ok) throw new Error("PayPal : création de la commande impossible.");
  return { id: (await r.json()).id as string };
}

export async function captureOrder(id: string): Promise<{ status: string; id: string; reference?: string }> {
  if (!/^[A-Z0-9]{10,30}$/.test(id)) throw new Error("Commande invalide.");
  const r = await fetch(`${BASE()}/v2/checkout/orders/${id}/capture`, { method: "POST", cache: "no-store", headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" } });
  if (!r.ok) throw new Error("PayPal : paiement non finalisé.");
  const d = await r.json();
  return { status: d.status as string, id: d.id as string, reference: d.purchase_units?.[0]?.custom_id as string | undefined };
}

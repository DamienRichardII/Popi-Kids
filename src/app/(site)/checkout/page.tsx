import type { Metadata } from "next";
import PayPalCheckout from "@/components/PayPalCheckout";
import { paypalConfigured, paypalEnv } from "@/lib/paypal";

export const metadata: Metadata = { title: "Paiement", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Le Client ID PayPal est public par conception ; le Client Secret reste côté serveur (routes /api/paypal/*). */
export default function Checkout() {
  return <PayPalCheckout clientId={paypalConfigured() ? process.env.PAYPAL_CLIENT_ID ?? null : null} env={paypalEnv()} />;
}

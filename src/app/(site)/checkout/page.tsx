import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Paiement", robots: { index: false } };

/** Le tunnel Stripe n'est pas branché : il dépend du choix du moteur e-commerce (voir docs/IMPLEMENTATION_PLAN.md, phase 2). */
export default function Checkout() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="section-title text-4xl">Paiement</h1>
      <p className="mt-4 text-muted">Le paiement sécurisé par Stripe sera activé après validation du moteur e-commerce. Aucune commande ne peut être passée pour l&apos;instant.</p>
      <Link href="/panier" className="btn btn-secondary mx-auto mt-8 w-fit">Retour au panier</Link>
    </div>
  );
}

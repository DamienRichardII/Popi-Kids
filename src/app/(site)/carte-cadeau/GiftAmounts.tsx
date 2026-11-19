"use client";
import { useState } from "react";

/** Choix du montant. L'achat en ligne n'est pas encore ouvert : la demande part par e-mail avec le montant choisi. */
export default function GiftAmounts({ amounts, email }: { amounts: number[]; email: string }) {
  const [a, setA] = useState<number | null>(null);
  const subject = encodeURIComponent(a ? `Carte cadeau POPI KIDS ${a} €` : "Carte cadeau POPI KIDS");
  const body = encodeURIComponent(a ? `Bonjour, je souhaite offrir une carte cadeau de ${a} €.` : "Bonjour, je souhaite offrir une carte cadeau.");
  return (
    <section className="mt-8 max-w-xl" aria-label="Montants disponibles">
      <h2 className="serif text-2xl">Choisissez un montant</h2>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Montant de la carte cadeau">
        {amounts.map((m) => (
          <button key={m} role="radio" aria-checked={a === m} onClick={() => setA(m)}
            className={`min-h-11 rounded-full border px-5 text-sm ${a === m ? "border-primary bg-primary text-primary-fg" : "border-line"}`}>{m} €</button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {a ? `Carte cadeau de ${a} € sélectionnée.` : "Sélectionnez le montant à offrir."} Le paiement en ligne des cartes cadeaux sera ouvert prochainement : en attendant, envoyez votre demande en un clic.
      </p>
      <a href={`mailto:${email}?subject=${subject}&body=${body}`} aria-disabled={!a} onClick={(e) => { if (!a) e.preventDefault(); }}
        className={`btn btn-primary mt-4 ${a ? "" : "pointer-events-none opacity-50"}`}>Demander cette carte cadeau</a>
    </section>
  );
}

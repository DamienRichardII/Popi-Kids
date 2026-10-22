import { notFound } from "next/navigation";
const PAGES: Record<string, string> = { cgv: "Conditions générales de vente", confidentialite: "Politique de confidentialité", "mentions-legales": "Mentions légales" };
export default async function Legal({ params }: { params: Promise<{ slug: string }> }) {
  const t = PAGES[(await params).slug];
  if (!t) notFound();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="section-title text-4xl">{t}</h1>
      <p className="mt-4 text-muted">Texte juridique à fournir et valider par POPI KIDS. Ces pages sont absentes du site actuel.</p>
    </div>
  );
}

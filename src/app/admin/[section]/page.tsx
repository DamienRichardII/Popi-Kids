import { notFound } from "next/navigation";
import { ADMIN_NAV } from "@/lib/sections";

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = ADMIN_NAV.find(([s]) => s === section);
  if (!entry) notFound();
  return (
    <div>
      <h1 className="section-title text-4xl">{entry[1]}</h1>
      <p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-muted">
        Cette section utilisera l&apos;interface native du moteur retenu (WooCommerce ou Medusa) ou une API sécurisée avec autorisations. À brancher après validation du moteur.
      </p>
    </div>
  );
}

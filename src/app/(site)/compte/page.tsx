import type { Metadata } from "next";
import Link from "next/link";
import { ACCOUNT_SECTIONS } from "@/lib/sections";
import { ChevronRight, Heart, MapPin, Package, Bell, User, LogOut } from "lucide-react";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false } };

const ICONS = { commandes: Package, adresses: MapPin, favoris: Heart, informations: User, notifications: Bell };

/** Authentification non branchée (dépend du moteur) : l'interface montre la structure, sans fausse donnée. */
export default function Account() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="section-title text-4xl">Mon compte</h1>
      <p className="mt-2 rounded-xl border border-dashed border-line p-4 text-sm text-muted">La connexion sera activée avec le moteur e-commerce. Ci-dessous, la structure de l&apos;espace client.</p>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        {ACCOUNT_SECTIONS.map(({ slug, label }) => { const Icon = ICONS[slug]; return (
          <li key={slug}><Link href={`/compte/${slug}`} className="flex min-h-14 items-center gap-4 px-5 hover:bg-surface-2"><Icon size={19} strokeWidth={1.6} /><span className="flex-1">{label}</span><ChevronRight size={18} className="text-muted" /></Link></li>
        ); })}
        <li><span className="flex min-h-14 items-center gap-4 px-5 text-muted"><LogOut size={19} strokeWidth={1.6} />Déconnexion</span></li>
      </ul>
    </div>
  );
}

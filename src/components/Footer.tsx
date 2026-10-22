import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/commerce";

export default function Footer() {
  const socials = Object.entries(SITE.socials).filter(([, href]) => href) as [string, string][];
  return (
    <footer className="mt-20 border-t border-line bg-surface-2 pb-6 pt-14">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 md:grid-cols-4">
        <div><Logo size="md" /><p className="mt-4 max-w-xs text-sm text-muted">Mode enfantine premium, de 6 mois à 16 ans.</p></div>
        <nav aria-label="Boutique"><h2 className="serif mb-3 text-xl">Boutique</h2>
          <ul className="space-y-2 text-sm text-muted">{CATEGORIES.slice(0, 5).map((c) => <li key={c.slug}><Link className="hover:text-fg" href={`/collections/${c.slug}`}>{c.name}</Link></li>)}</ul></nav>
        <nav aria-label="Informations"><h2 className="serif mb-3 text-xl">Informations</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-fg" href="/contact-us">Contact</Link></li>
            <li><Link className="hover:text-fg" href="/compte">Mon compte</Link></li>
            {/* Pages légales : contenu à fournir/valider par le client (absentes du site actuel) */}
            <li><Link className="hover:text-fg" href="/legal/cgv">Conditions générales de vente</Link></li>
            <li><Link className="hover:text-fg" href="/legal/confidentialite">Politique de confidentialité</Link></li>
            <li><Link className="hover:text-fg" href="/legal/mentions-legales">Mentions légales</Link></li>
          </ul></nav>
        <div><h2 className="serif mb-3 text-xl">Newsletter</h2>
          <p className="mb-3 text-sm text-muted">Nouveautés et offres, sans spam.</p>
          <form action="/api/newsletter" method="post" className="flex gap-2">
            <label htmlFor="nl" className="sr-only">Votre e-mail</label>
            <input id="nl" type="email" name="email" required placeholder="Votre e-mail" className="h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm outline-none focus:border-accent-strong" />
            <button className="btn btn-primary !min-h-11 !px-5 text-sm">OK</button>
          </form>
          {socials.length > 0 && <ul className="mt-5 flex gap-4 text-sm">{socials.map(([n, h]) => <li key={n}><a href={h} rel="noopener" className="capitalize underline">{n}</a></li>)}</ul>}
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1400px] px-6 text-xs text-muted">© {new Date().getFullYear()} POPI KIDS. Tous droits réservés.</p>
    </footer>
  );
}

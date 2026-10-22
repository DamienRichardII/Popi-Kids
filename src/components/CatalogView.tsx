import Link from "next/link";
import ProductGrid from "./ProductGrid";
import { getProducts, type Query } from "@/lib/commerce";

export type SP = Record<string, string | string[] | undefined>;
const arr = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const num = (v: string | string[] | undefined) => { const n = Number(arr(v)[0]); return arr(v)[0] && Number.isFinite(n) ? n : undefined; };

export function parseQuery(sp: SP, category?: string): Query & { page: number } {
  const sort = arr(sp.sort)[0];
  return {
    category, q: arr(sp.q)[0], size: arr(sp.taille), color: arr(sp.couleur), min: num(sp.min), max: num(sp.max),
    inStock: arr(sp.dispo)[0] === "1",
    sort: sort === "prix-asc" || sort === "prix-desc" || sort === "nouveautes" || sort === "populaires" ? sort : undefined,
    page: Math.max(1, num(sp.page) ?? 1),
  };
}

const PAGE_SIZE = 12;
const SIZES = ["2-3 ans", "4-5 ans", "6-7 ans", "8-9 ans"];

/** Filtres = formulaire GET : l'URL est la source de vérité (partageable, sans JavaScript). */
export default async function CatalogView({
  title, description, crumbs, category, sp, basePath,
}: { title: string; description?: string; crumbs: { label: string; href?: string }[]; category?: string; sp: SP; basePath: string }) {
  const { page, ...q } = parseQuery(sp, category);
  const all = await getProducts(q);
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const shown = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const colors = [...new Set((await getProducts({ category })).flatMap((p) => p.colors.map((c) => c.name)))];
  const link = (n: number) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) for (const x of arr(v)) if (k !== "page") u.append(k, x);
    if (n > 1) u.set("page", String(n));
    return `${basePath}${u.size ? `?${u}` : ""}`;
  };
  const chk = "mr-2 h-4 w-4 accent-[var(--accent-strong)]";

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-muted">
        <ol className="flex flex-wrap gap-2">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex gap-2">{c.href ? <Link href={c.href} className="hover:text-fg">{c.label}</Link> : <span aria-current="page" className="text-fg">{c.label}</span>}{i < crumbs.length - 1 && <span aria-hidden>/</span>}</li>
          ))}
        </ol>
      </nav>
      <h1 className="section-title text-4xl sm:text-5xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <form method="get" action={basePath} aria-label="Filtres" className="space-y-6 text-sm">
          {q.q && <input type="hidden" name="q" value={q.q} />}
          <details open className="group lg:[&]:open"><summary className="serif cursor-pointer text-xl lg:pointer-events-none">Filtres</summary>
            <div className="mt-4 space-y-6">
              <fieldset><legend className="mb-2 font-medium">Taille</legend>
                {SIZES.map((s) => <label key={s} className="flex items-center py-1.5"><input className={chk} type="checkbox" name="taille" value={s} defaultChecked={q.size?.includes(s)} />{s}</label>)}</fieldset>
              <fieldset><legend className="mb-2 font-medium">Couleur</legend>
                {colors.map((c) => <label key={c} className="flex items-center py-1.5"><input className={chk} type="checkbox" name="couleur" value={c} defaultChecked={q.color?.includes(c)} />{c}</label>)}</fieldset>
              <fieldset><legend className="mb-2 font-medium">Prix (€)</legend>
                <div className="flex gap-2">
                  <label className="sr-only" htmlFor="min">Prix minimum</label><input id="min" name="min" type="number" min={0} placeholder="Min" defaultValue={q.min} className="h-10 w-full rounded-lg border border-line bg-surface px-3" />
                  <label className="sr-only" htmlFor="max">Prix maximum</label><input id="max" name="max" type="number" min={0} placeholder="Max" defaultValue={q.max} className="h-10 w-full rounded-lg border border-line bg-surface px-3" />
                </div></fieldset>
              <label className="flex items-center"><input className={chk} type="checkbox" name="dispo" value="1" defaultChecked={q.inStock} />En stock uniquement</label>
              <div>
                <label htmlFor="sort" className="mb-2 block font-medium">Trier par</label>
                <select id="sort" name="sort" defaultValue={q.sort ?? ""} className="h-10 w-full rounded-lg border border-line bg-surface px-3">
                  <option value="">Pertinence</option><option value="populaires">Popularité</option><option value="nouveautes">Nouveautés</option>
                  <option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option>
                </select>
              </div>
              <div className="flex gap-2"><button className="btn btn-primary !min-h-11 flex-1 text-sm">Appliquer</button><Link href={basePath} className="btn btn-secondary !min-h-11 text-sm">Réinitialiser</Link></div>
            </div>
          </details>
        </form>

        <div>
          <p className="mb-4 text-sm text-muted" role="status">{all.length} produit{all.length > 1 ? "s" : ""}</p>
          <ProductGrid products={shown} cols="lg:grid-cols-3 xl:grid-cols-4"
            empty={<div className="rounded-2xl border border-dashed border-line py-16 text-center"><p className="serif text-2xl">Aucun produit ne correspond</p><Link href={basePath} className="mt-4 inline-block text-sm underline">Réinitialiser les filtres</Link></div>} />
          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={link(n)} aria-current={n === page ? "page" : undefined}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border ${n === page ? "border-primary bg-primary text-primary-fg" : "border-line"}`}>{n}</Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

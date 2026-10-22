"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X, Truck, MessageCircle } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/commerce";
import { useCart } from "./CartProvider";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

function SearchForm({ onDone, className = "" }: { onDone?: () => void; className?: string }) {
  return (
    <form action="/shop" role="search" onSubmit={onDone} className={className}>
      <label htmlFor="q" className="sr-only">Rechercher un produit</label>
      <input id="q" name="q" type="search" placeholder="Rechercher un produit…" autoFocus
        className="h-11 w-full rounded-full border border-line bg-surface px-5 text-sm outline-none focus:border-accent-strong" />
    </form>
  );
}

export default function Header() {
  const path = usePathname();
  const { count, setOpen, hydrated } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const badge = hydrated && count > 0 ? count : 0;

  return (
    <>
      {/* Bandeau supérieur */}
      <div className="hidden border-b border-line text-xs text-muted sm:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2.5">
          <span className="flex items-center gap-2"><Truck size={15} aria-hidden /> {SITE.freeShipping}</span>
          <Link href="/contact-us" className="flex items-center gap-2 hover:text-fg"><MessageCircle size={15} aria-hidden /> Une question ? Contactez-nous</Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-[88px] sm:px-6 lg:flex lg:gap-8">
          {/* Mobile : hamburger */}
          <button className="flex h-11 w-11 items-center justify-center lg:hidden" aria-label="Ouvrir le menu" aria-expanded={menu} onClick={() => setMenu(true)}>
            <Menu />
          </button>
          <div className="justify-self-center lg:justify-self-auto"><Logo size="sm" /></div>

          {/* Desktop nav + mega-menu */}
          <nav aria-label="Navigation principale" className="hidden flex-1 items-center justify-center gap-7 text-sm lg:flex">
            {NAV.map((n) => {
              const active = n.href === "/" ? path === "/" : path.startsWith(n.href) && n.href !== "/#engagements";
              return "mega" in n ? (
                <div key={n.label} className="group relative">
                  <Link href={n.href} className={`py-2 hover:text-accent-strong ${active ? "border-b border-fg" : ""}`}>{n.label}</Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 translate-y-2 rounded-2xl border border-line bg-surface p-6 opacity-0 shadow-[var(--shadow)] transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {CATEGORIES.map((c) => (
                        <li key={c.slug}><Link href={`/collections/${c.slug}`} className="serif text-lg hover:text-accent-strong">{c.name}</Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link key={n.label} href={n.href} className={`py-2 hover:text-accent-strong ${active ? "border-b border-fg" : ""}`}>{n.label}</Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-1">
            <ThemeSwitcher />
            <button className="flex h-11 w-11 items-center justify-center" aria-label="Rechercher" onClick={() => setSearch((s) => !s)}><Search size={21} /></button>
            <Link href="/compte" aria-label="Mon compte" className="hidden h-11 w-11 items-center justify-center sm:flex"><User size={21} /></Link>
            <button className="relative flex h-11 w-11 items-center justify-center" aria-label={`Panier, ${badge} article${badge > 1 ? "s" : ""}`} onClick={() => setOpen(true)}>
              <ShoppingBag size={21} />
              {badge > 0 && <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-[#06172b]">{badge}</span>}
            </button>
          </div>
        </div>
        {search && <div className="border-t border-line px-4 py-3 sm:px-6"><SearchForm onDone={() => setSearch(false)} className="mx-auto max-w-xl" /></div>}
      </header>

      {/* Menu mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? "" : "pointer-events-none"}`} aria-hidden={!menu}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${menu ? "opacity-100" : "opacity-0"}`} onClick={() => setMenu(false)} />
        <nav aria-label="Menu mobile" className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-bg p-6 transition-transform duration-300 ${menu ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="mb-6 flex h-11 w-11 items-center justify-center self-end" aria-label="Fermer le menu" onClick={() => setMenu(false)}><X /></button>
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.label}><Link href={n.href} onClick={() => setMenu(false)} className="serif block py-3 text-2xl">{n.label}</Link></li>
            ))}
          </ul>
          <p className="mt-auto text-xs text-muted">{SITE.freeShipping}</p>
        </nav>
      </div>
    </>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  /** Bannière complète (texte et logo intégrés au visuel) affichée sur ordinateur. */
  desktop: React.ReactNode;
  /** Partie photo de la bannière, affichée sur mobile (le texte est alors en HTML). */
  mobile: React.ReactNode;
  thumb: React.ReactNode;
  thumbLabel: string;
  title: string;
  cta: { label: string; href: string };
};

/** Carrousel : bannières fournies par le client + vignettes de navigation en dessous. */
export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [paused, n]);
  const s = slides[i] ?? slides[0];
  if (!s) return null;

  return (
    <section aria-roledescription="carrousel" aria-label="Offres et mises en avant"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative">
        {/* Ordinateur : bannière complète cliquable */}
        <div className="relative hidden aspect-[1920/800] max-h-[640px] w-full overflow-hidden lg:block">
          {slides.map((x, k) => (
            <div key={k} aria-hidden={k !== i} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              {x.desktop}
              <Link href={x.cta.href} tabIndex={k === i ? 0 : -1} aria-label={`${x.title} — ${x.cta.label}`} className="absolute inset-0" />
            </div>
          ))}
          <button aria-label="Slide précédente" onClick={() => setI((i - 1 + n) % n)}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow"><ChevronLeft /></button>
          <button aria-label="Slide suivante" onClick={() => setI((i + 1) % n)}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow"><ChevronRight /></button>
        </div>
        {/* Mobile : photo + texte HTML */}
        <div className="relative h-[240px] overflow-hidden sm:h-[380px] lg:hidden">
          {slides.map((x, k) => (
            <div key={k} aria-hidden={k !== i} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}>{x.mobile}</div>
          ))}
        </div>
        <h1 className="sr-only">{s.title}</h1>
      </div>
      <div className="flex flex-col gap-3 px-6 py-6 lg:hidden">
        <p className="serif text-3xl leading-tight" aria-hidden>{s.title}</p>
        <Link href={s.cta.href} className="btn btn-primary">{s.cta.label} <ArrowRight size={18} /></Link>
      </div>
      <ul className="mx-auto grid max-w-[1400px] grid-cols-3 gap-2 px-4 pb-2 pt-1 sm:gap-4 sm:px-6 lg:pt-5" aria-label="Choisir une mise en avant">
        {slides.map((x, k) => (
          <li key={k}>
            <button onClick={() => setI(k)} aria-current={k === i} aria-label={x.thumbLabel}
              className={`group flex w-full flex-col overflow-hidden rounded-xl border bg-surface text-left transition ${k === i ? "border-fg" : "border-line opacity-80 hover:opacity-100"}`}>
              <span className="relative block aspect-[3/2] w-full">{x.thumb}</span>
              <span className="px-2 py-2 text-center text-[11px] font-medium sm:text-sm">{x.thumbLabel}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

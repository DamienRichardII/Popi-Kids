"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "./Logo";

export type HeroSlide = {
  visual: React.ReactNode;
  eyebrow?: string;
  title: string;
  text?: string;
  cta: { label: string; href: string };
  cta2?: { label: string; href: string };
};

/** Carrousel dynamique : chaque slide porte son visuel (rendu côté serveur) et son message. */
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
    <section aria-roledescription="carrousel" aria-label="Offres et mises en avant" className="relative"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative h-[300px] overflow-hidden sm:h-[420px] lg:h-[600px]">
        <div className="absolute inset-0 lg:left-auto lg:w-[60%] lg:[mask-image:linear-gradient(to_right,transparent,#000_28%)]">
          {slides.map((x, k) => (
            <div key={k} aria-hidden={k !== i} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}>{x.visual}</div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 hidden w-[42%] flex-col items-center justify-center px-8 text-center lg:flex" aria-live="off">
          <Logo size="xl" />
          {s.eyebrow && <p className="mt-6 text-xs font-medium uppercase tracking-[.25em] text-accent-strong">{s.eyebrow}</p>}
          <h1 className="serif mt-3 text-4xl leading-tight text-[color:var(--hero-title)]">{s.title}</h1>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={s.cta.href} className="btn btn-primary">{s.cta.label} <ArrowRight size={18} /></Link>
            {s.cta2 && <Link href={s.cta2.href} className="btn btn-secondary">{s.cta2.label} <ArrowRight size={18} /></Link>}
          </div>
        </div>
        <button aria-label="Slide précédente" onClick={() => setI((i - 1 + n) % n)}
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow lg:flex"><ChevronLeft /></button>
        <button aria-label="Slide suivante" onClick={() => setI((i + 1) % n)}
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow lg:flex"><ChevronRight /></button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, k) => (
            <button key={k} aria-label={`Slide ${k + 1}`} aria-current={k === i} onClick={() => setI(k)}
              className="flex h-6 w-6 items-center justify-center"><span className={`block h-2 rounded-full bg-fg transition-all ${k === i ? "w-6" : "w-2 opacity-40"}`} /></button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 px-6 py-6 lg:hidden">
        {s.eyebrow && <p className="text-xs font-medium uppercase tracking-[.25em] text-accent-strong">{s.eyebrow}</p>}
        <h1 className="serif text-3xl leading-tight">{s.title}</h1>
        <Link href={s.cta.href} className="btn btn-primary">{s.cta.label}</Link>
        {s.cta2 && <Link href={s.cta2.href} className="btn btn-secondary">{s.cta2.label}</Link>}
      </div>
    </section>
  );
}

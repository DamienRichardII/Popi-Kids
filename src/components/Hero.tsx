"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "./Logo";

/** `slides` : nœuds <Visual> rendus côté serveur (clé hero-1..3). */
export default function Hero({ slides }: { slides: React.ReactNode[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <section aria-roledescription="carrousel" aria-label="Mise en avant" className="relative"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Mobile : visuel au-dessus, CTA dessous ; desktop : texte superposé */}
      <div className="relative h-[300px] overflow-hidden sm:h-[420px] lg:h-[560px]">
        {slides.map((s, k) => (
          <div key={k} aria-hidden={k !== i} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`}>{s}</div>
        ))}
        <div className="absolute inset-0 hidden lg:block" style={{ background: "var(--overlay)" }} />
        <div className="absolute inset-y-0 left-[6%] hidden flex-col justify-center lg:flex">
          <Logo size="xl" />
          <div className="mt-10 flex gap-4">
            <Link href="/shop" className="btn btn-primary">Découvrir les collections <ArrowRight size={18} /></Link>
            <Link href="/shop?sort=populaires" className="btn btn-secondary">Nos best-sellers <ArrowRight size={18} /></Link>
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
        <Link href="/shop" className="btn btn-primary">Découvrir</Link>
        <Link href="/shop?sort=populaires" className="btn btn-secondary">Nos best-sellers</Link>
      </div>
    </section>
  );
}

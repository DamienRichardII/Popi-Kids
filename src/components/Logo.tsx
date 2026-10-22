import Link from "next/link";

/** Wordmark typographique reproduisant la maquette (remplaçable par public/assets/logo.svg). */
export default function Logo({ size = "md" }: { size?: "sm" | "md" | "xl" }) {
  const s = { sm: ["text-2xl", "text-[9px]"], md: ["text-4xl", "text-xs"], xl: ["text-[7rem] md:text-[9rem]", "text-4xl md:text-6xl"] }[size];
  return (
    <Link href="/" aria-label="POPI KIDS – accueil" className="inline-block text-center leading-none text-[color:var(--hero-title)]">
      <span className={`serif block font-medium tracking-wide ${s[0]}`}>POPI</span>
      <span className={`serif mt-1 flex items-center justify-center gap-2 tracking-[.3em] ${s[1]}`}>
        <i className="h-px w-5 bg-current opacity-70" /> KIDS <i className="h-px w-5 bg-current opacity-70" />
      </span>
    </Link>
  );
}

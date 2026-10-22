"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Démonstration interne uniquement : masqué si NEXT_PUBLIC_THEME_SWITCHER !== "true". */
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("ivory");
  useEffect(() => { setTheme(document.documentElement.dataset.theme ?? "ivory"); }, []);
  if (process.env.NEXT_PUBLIC_THEME_SWITCHER !== "true") return null;
  const next = theme === "ivory" ? "midnight" : "ivory";
  return (
    <button
      className="flex h-11 items-center gap-1.5 rounded-full px-3 text-[11px] uppercase tracking-wider text-muted hover:text-fg"
      aria-label={`Démo : passer au thème ${next === "midnight" ? "Midnight Gold" : "Ivory Luxury"}`}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("popi-theme", next); } catch { /* ignore */ }
        setTheme(next);
      }}
    >
      {theme === "ivory" ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden xl:inline">Démo thème</span>
    </button>
  );
}

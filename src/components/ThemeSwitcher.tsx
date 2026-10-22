"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Bouton mode nuit (Midnight Gold) / mode jour (Ivory Luxury). Masqué uniquement si NEXT_PUBLIC_THEME_SWITCHER="false". */
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("ivory");
  useEffect(() => { setTheme(document.documentElement.dataset.theme ?? "ivory"); }, []);
  if (process.env.NEXT_PUBLIC_THEME_SWITCHER === "false") return null;
  const next = theme === "ivory" ? "midnight" : "ivory";
  return (
    <button
      className="flex h-11 items-center gap-1.5 rounded-full px-3 text-[11px] uppercase tracking-wider text-muted hover:text-fg"
      aria-label={next === "midnight" ? "Activer le mode nuit" : "Activer le mode jour"}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("popi-theme", next); } catch { /* ignore */ }
        setTheme(next);
      }}
    >
      {theme === "ivory" ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden xl:inline">{theme === "ivory" ? "Mode nuit" : "Mode jour"}</span>
    </button>
  );
}

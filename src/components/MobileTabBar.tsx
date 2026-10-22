"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, User } from "lucide-react";
import { useCart } from "./CartProvider";

const TABS = [
  { href: "/", label: "Accueil", Icon: Home },
  { href: "/shop", label: "Boutique", Icon: Store },
  { href: "/panier", label: "Panier", Icon: ShoppingBag },
  { href: "/compte", label: "Compte", Icon: User },
];

/** Navigation inférieure fixe (mobile). Le layout réserve sa hauteur : elle ne masque jamais un bouton d'achat. */
export default function MobileTabBar() {
  const path = usePathname();
  const { count, hydrated } = useCart();
  if (path.startsWith("/admin")) return null;
  return (
    <nav aria-label="Navigation mobile" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur lg:hidden">
      <ul className="grid h-16 grid-cols-4">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-1 text-[11px] ${active ? "text-accent-strong" : "text-muted"}`}>
                <Icon size={21} />
                {label}
                {href === "/panier" && hydrated && count > 0 && (
                  <span className="absolute right-[28%] top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-[#06172b]">{count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

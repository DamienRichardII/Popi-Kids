import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import { ADMIN_NAV } from "@/lib/sections";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Pas d'authentification tant que le moteur n'est pas choisi : interface fermée en production.
  if (process.env.NODE_ENV === "production" && process.env.ADMIN_PREVIEW !== "true") notFound();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[230px_1fr]">
      <aside className="border-b border-line bg-surface p-4 md:border-b-0 md:border-r md:p-5">
        <div className="mb-4 md:mb-8"><Logo size="sm" /></div>
        <nav aria-label="Administration"><ul className="hide-scroll flex gap-1 overflow-x-auto md:flex-col">
          {ADMIN_NAV.map(([s, l]) => <li key={s}><Link href={`/admin${s && `/${s}`}`} className="block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm hover:bg-surface-2">{l}</Link></li>)}
        </ul></nav>
      </aside>
      <div className="p-4 sm:p-8">{children}</div>
    </div>
  );
}

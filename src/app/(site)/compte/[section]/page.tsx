import { notFound } from "next/navigation";
import Link from "next/link";
import { ACCOUNT_SECTIONS } from "@/lib/sections";

export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = ACCOUNT_SECTIONS.find((x) => x.slug === section);
  if (!s) notFound();
  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <Link href="/compte" className="text-sm text-muted">← Mon compte</Link>
      <h1 className="section-title mt-2 text-4xl">{s.label}</h1>
      <p className="mt-6 rounded-2xl border border-dashed border-line py-12 text-center text-muted">{s.text}</p>
    </div>
  );
}

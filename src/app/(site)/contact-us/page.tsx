import type { Metadata } from "next";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "Contact" };
export default function Contact() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="section-title text-4xl">Contact</h1>
      <p className="mt-4 text-muted">Une question ? Écrivez-nous : <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
    </div>
  );
}

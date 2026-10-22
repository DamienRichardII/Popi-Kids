import Image from "next/image";
import { resolveAsset } from "@/lib/assets";

/** Affiche l'asset fourni s'il existe dans public/assets, sinon un placeholder identifiable. */
export default function Visual({
  assetKey, alt, className = "", sizes = "100vw", priority = false, round = false,
}: { assetKey: string; alt?: string; className?: string; sizes?: string; priority?: boolean; round?: boolean }) {
  const { src, label } = resolveAsset(assetKey);
  const shape = round ? "rounded-full" : "";
  if (src) {
    return (
      <div className={`relative overflow-hidden ${shape} ${className}`}>
        <Image src={src} alt={alt ?? label} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`Visuel à fournir : ${label}`}
      className={`relative flex items-center justify-center overflow-hidden bg-surface-2 text-center ${shape} ${className}`}
      style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 14px, rgb(198 163 108 / .12) 14px 15px)" }}
    >
      <span className="px-2 text-[10px] font-medium uppercase leading-tight tracking-widest text-accent-strong sm:text-xs">
        Visuel à fournir
        <span className="mt-1 block normal-case tracking-normal text-muted">{assetKey}</span>
      </span>
    </div>
  );
}

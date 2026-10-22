import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import Visual from "./Visual";

export default function ProductGrid({ products, cols = "lg:grid-cols-4", empty }: { products: Product[]; cols?: string; empty?: React.ReactNode }) {
  if (products.length === 0) return <>{empty ?? <p className="py-16 text-center text-muted">Aucun produit pour le moment.</p>}</>;
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 ${cols}`}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 2}
            visual={<Visual assetKey={p.images[0] ?? p.slug} alt={p.name} className="h-full w-full" sizes="(min-width:1024px) 20vw, 50vw" priority={i < 2} />} />
        </li>
      ))}
    </ul>
  );
}

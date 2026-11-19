import { getProduct } from "./commerce";
import { sweatDiscount } from "./offers";
import { PERSONALISATION_FEE, PRINT_COLORS, PRINT_FONTS } from "./personalisation";
import { shippingFor } from "./shipping";

/** Ligne envoyée par le navigateur : on n'accepte QUE l'identifiant produit, la quantité et les choix ; les prix viennent du catalogue. */
export type OrderInput = { slug: string; qty: number; color?: string; size?: string; custom?: { type: string; text: string; font?: string; color?: string } };
export type PricedItem = { name: string; description: string; unit: number; qty: number; sku: string };
export type PricedOrder = { items: PricedItem[]; itemTotal: number; discount: number; shipping: number; total: number; personalisation: number };

const clean = (s: unknown, max: number) => String(s ?? "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max);

/** Calcule la commande côté serveur (prix catalogue, supplément de personnalisation, offre, livraison). Lève une Error si une ligne est invalide. */
export async function priceOrder(input: unknown): Promise<PricedOrder> {
  if (!Array.isArray(input) || input.length === 0 || input.length > 30) throw new Error("Panier invalide.");
  const items: PricedItem[] = [];
  const discountLines: { slug: string; price: number; qty: number }[] = [];
  let personalisation = 0;
  for (const raw of input as OrderInput[]) {
    const p = await getProduct(String(raw?.slug ?? ""));
    const qty = Math.floor(Number(raw?.qty));
    if (!p || !Number.isFinite(qty) || qty < 1 || qty > 10) throw new Error("Article invalide.");
    const details = [clean(raw.color, 40), clean(raw.size, 20)].filter(Boolean);
    let custom = "";
    if (raw.custom) {
      const c = raw.custom;
      if (!p.customizable || !["prenom", "phrase", "logo"].includes(c.type)) throw new Error("Personnalisation invalide.");
      const text = clean(c.text, c.type === "prenom" ? 15 : c.type === "phrase" ? 40 : 120);
      if (!text) throw new Error("Personnalisation incomplète.");
      const font = PRINT_FONTS.find((f) => f.id === c.font)?.label;
      const color = PRINT_COLORS.find((x) => x.name === c.color)?.name;
      custom = `Perso ${c.type === "logo" ? "fichier" : c.type} « ${text} »${font ? ` · ${font}` : ""}${color ? ` · ${color}` : ""}`;
      personalisation += qty * PERSONALISATION_FEE;
    }
    items.push({ name: clean(p.name, 100), description: [...details, custom].filter(Boolean).join(" · ").slice(0, 127), unit: p.price, qty, sku: p.slug });
    discountLines.push({ slug: p.slug, price: p.price, qty });
  }
  if (personalisation > 0) items.push({ name: "Personnalisation", description: "Supplément de personnalisation (par article)", unit: PERSONALISATION_FEE, qty: personalisation / PERSONALISATION_FEE, sku: "personnalisation" });
  const itemTotal = items.reduce((n, i) => n + i.unit * i.qty, 0);
  const discount = sweatDiscount(discountLines);
  const shipping = shippingFor(itemTotal - discount);
  return { items, itemTotal, discount, shipping, total: itemTotal - discount + shipping, personalisation };
}

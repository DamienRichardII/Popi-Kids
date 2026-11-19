import { describe, expect, it } from "vitest";
import { priceOrder } from "@/lib/order";
import { buildOrder } from "@/lib/paypal";

describe("commande PayPal (calcul serveur)", () => {
  it("prend les prix du catalogue et ajoute 5 € par article personnalisé", async () => {
    const o = await priceOrder([{ slug: "urban", qty: 2, custom: { type: "prenom", text: "Léo", font: "manuscrite", color: "Noir" } }]);
    expect(o.itemTotal).toBe(2 * 1950 + 2 * 500);
    expect(o.personalisation).toBe(1000);
    expect(o.total).toBe(o.itemTotal - o.discount + o.shipping);
  });
  it("applique l'offre 4ᵉ article offert sans remise sur le supplément", async () => {
    const o = await priceOrder([{ slug: "clasica", qty: 2 }, { slug: "urban", qty: 2 }]);
    expect(o.discount).toBe(1730);
    expect(o.total).toBe(2 * 1730 + 2 * 1950 - 1730);
  });
  it("refuse un article inconnu, une quantité folle ou une personnalisation sur un article non personnalisable", async () => {
    await expect(priceOrder([{ slug: "inconnu", qty: 1 }])).rejects.toThrow();
    await expect(priceOrder([{ slug: "urban", qty: 99 }])).rejects.toThrow();
    await expect(priceOrder([{ slug: "nepal", qty: 1, custom: { type: "prenom", text: "A" } }])).rejects.toThrow();
  });
  it("le corps PayPal est cohérent : somme des lignes = item_total, total = item_total - remise + livraison", async () => {
    const o = await priceOrder([{ slug: "clasica", qty: 2 }, { slug: "urban", qty: 2, custom: { type: "phrase", text: "Bravo" } }]);
    const b = buildOrder(o, "POPI-TEST").purchase_units[0]!;
    const sum = b.items.reduce((n, i) => n + Number(i.unit_amount.value) * Number(i.quantity), 0);
    const bd = b.amount.breakdown as Record<string, { value: string }>;
    expect(sum.toFixed(2)).toBe(bd.item_total!.value);
    expect((Number(bd.item_total!.value) + Number(bd.shipping!.value) - Number(bd.discount!.value)).toFixed(2)).toBe(b.amount.value as string);
  });
});

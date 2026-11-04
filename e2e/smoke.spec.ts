import { expect, test } from "@playwright/test";

test("pas de débordement horizontal sur l'accueil", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("produit en rupture non achetable", async ({ page }) => {
  await page.goto("/product/antartida");
  await expect(page.getByRole("button", { name: "Rupture de stock" })).toBeDisabled();
});

test("ajout au panier d'un produit disponible", async ({ page }) => {
  await page.goto("/product/salento");
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page.getByRole("dialog", { name: "Panier" })).toContainText("Salento");
});

test("filtres synchronisés avec l'URL", async ({ page }) => {
  await page.goto("/shop?sort=prix-asc&dispo=1");
  await expect(page.locator("#sort")).toHaveValue("prix-asc");
});

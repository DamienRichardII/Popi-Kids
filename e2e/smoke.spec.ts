import { expect, test } from "@playwright/test";

test("pas de débordement horizontal sur l'accueil", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("variante indisponible non achetable + ajout au panier", async ({ page }) => {
  await page.goto("/product/sweat-essential");
  await expect(page.getByRole("button", { name: "6-7 ans" })).toBeDisabled();
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page.getByText("Veuillez choisir une taille.")).toContainText("taille");
  await page.getByRole("button", { name: "2-3 ans" }).click();
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page.getByRole("dialog", { name: "Panier" })).toContainText("Sweat Essential");
});

test("filtres synchronisés avec l'URL", async ({ page }) => {
  await page.goto("/shop?sort=prix-asc&dispo=1");
  await expect(page.locator("#sort")).toHaveValue("prix-asc");
});

import type { NextConfig } from "next";

// Redirections depuis l'ancien site WordPress/WooCommerce (URLs relevées dans wp-sitemap).
// Les slugs de catégories restent à valider avec le client (voir docs/AUDIT_POPI_KIDS.md).
const config: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: "/product-category/:slug*", destination: "/collections/:slug*", permanent: true },
      { source: "/cart", destination: "/panier", permanent: true },
      { source: "/my-account/:path*", destination: "/compte", permanent: true },
    ];
  },
};
export default config;

export type Color = { name: string; hex: string };
export type Size = { label: string; stock: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Prix en centimes d'euro */
  price: number;
  categories: string[];
  colors: Color[];
  sizes: Size[];
  /** Clés d'assets (voir lib/assets.ts). Jamais d'URL externe. */
  images: string[];
  description: string;
  composition?: string;
  isNew?: boolean;
  /** true tant que le produit vient du jeu d'exemples, pas du catalogue réel */
  isDemo: boolean;
};

export type Category = { slug: string; name: string; description: string; image: string };

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  color: string;
  size: string;
  qty: number;
  image: string;
};

export type AdminStats = {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  series: { label: string; value: number }[];
  recentOrders: { id: string; customer: string; total: number; status: string }[];
  lowStock: { name: string; size: string; stock: number }[];
};

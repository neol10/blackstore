export type ProductCategory =
  | "all"
  | "tenis"
  | "camisetas"
  | "esportivo"
  | "bermudas"
  | "moletons"
  | "casual-social";

export interface CategoryItem {
  id: ProductCategory;
  name: string;
  shortDescription: string;
  image: string;
  targetFilter: ProductCategory;
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  image: string;
  isDemo: boolean;
  highlightBadge?: string;
}

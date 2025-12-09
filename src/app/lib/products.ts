// src/lib/products.ts

export type ProductType = {
  category?: string;
  id: string;
  name: string;
  price: number;
  description: string;
  image: string; // base64
  stock?: number;
  sellerId?: string;
  categoryId?: string;
};

const STORAGE_KEY = "products";

// Lire
export function getProducts(): ProductType[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// Lire 1 produit
export function getProduct(id: string) {
  return getProducts().find((p) => p.id === id);
}

// Ajouter
export function addProduct(product: ProductType) {
  const list = getProducts();
  list.push(product);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Modifier
export function updateProduct(id: string, updated: Partial<ProductType>) {
  const list = getProducts().map((p) =>
    p.id === id ? { ...p, ...updated } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Supprimer
export function deleteProduct(id: string) {
  const list = getProducts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

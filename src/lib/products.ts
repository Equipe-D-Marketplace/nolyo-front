export interface ProductType {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: string;
    status: string;
    createdAt: string;
    sellerId: string;
}

const STORAGE_KEY = "products";

export const getProducts = (): ProductType[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addProduct = (product: ProductType): void => {
    if (typeof window === "undefined") return;
    const products = getProducts();
    products.push(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

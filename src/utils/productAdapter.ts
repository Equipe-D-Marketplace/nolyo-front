// utils/productAdapter.ts
import { ProductType } from "@/lib/products";

export const adaptProductForCard = (product: ProductType) => {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: {
            id: 0, // ou une logique pour mapper
            name: product.category || "Autre",
            description: product.category || "Catégorie par défaut",
        },
        imageUrl: product.image || "/placeholder.png",
        imageAlt: product.name,
    };
};
// app/product/page.tsx (ou votre chemin actuel)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, ProductType } from "@/lib/products";
import styles from "../dashboard.module.css";

// Adapter la structure de données pour ProductCard
const adaptProduct = (p: ProductType) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  category: {
    id: 0,
    name: p.category || "Autre",
    description: p.category || "Catégorie",
  },
  imageUrl: p.image || "/placeholder.png",
  imageAlt: p.name,
});

export default function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(2000);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesPrice = p.price >= priceMin && p.price <= priceMax;
    return matchesCategory && matchesPrice;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Découvrez nos produits</h1>

      {/* Filtres */}
      <div className={styles.filterContainer}>
        <div>
          <span className={styles.filterLabel}>Catégories :</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.priceRange}>
          <span className={styles.filterLabel}>Prix :</span>
          <input
            type="range"
            min="0"
            max="2000"
            value={priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            className={styles.rangeInput}
          />
          <input
            type="range"
            min="0"
            max="2000"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className={styles.rangeInput}
          />
          <span>{priceMin}€ – {priceMax}€</span>
        </div>
      </div>

      {/* Grille de produits avec ProductCard */}
      <div className={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <Link href={`/product/${p.id}`} key={p.id}>
              <ProductCard {...adaptProduct(p)} />
            </Link>
          ))
        ) : (
          <div className={styles.noResults}>Aucun produit trouvé.</div>
        )}
      </div>
    </div>
  );
}
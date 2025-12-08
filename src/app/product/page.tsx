"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct, ProductType } from "../lib/products";
import styles from "../dashboard.module.css";
import Button from "@/components/Button";

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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "20px", textAlign: "center" }}>
        Découvrez nos produits
      </h1>

      {/* Filtres */}
      <div className={styles.filterContainer}>
        <div>
          <span className={styles.filterLabel}>Catégories :</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.priceRange}>
          <span className={styles.filterLabel}>Prix :</span>
          <span>{priceMin}€ Min</span>
          <input
            type="range"
            min="0"
            max="2000"
            value={priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            style={{ marginLeft: "10px" }}
          />
          <input
            type="range"
            min="0"
            max="2000"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            style={{ marginLeft: "10px" }}
          />
          <span>{priceMax}€ Max</span>
        </div>
      </div>

      {/* Grille de produits */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filteredProducts.map((p) => (
          <div key={p.id} className={styles.productCard}>
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className={styles.productImage}
              />
            )}
            <div className={styles.productCategory}>{p.category}</div>
            <h3 className={styles.productName}>{p.name}</h3>
            <div className={styles.productPrice}>{p.price} €</div>
            <Link href={`/product/${p.id}`} className={styles.addToCartButton}>
              Ajouter au panier
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <Button label="Précedent" type="button" classNames={["btn-primary"]} disabled={false}></Button>
        <span>Page 1 / 1</span>
        <Button label="Suivant" type="button" classNames={["btn-primary"]} disabled={false}></Button>
      </div>
    </div>
  );
}
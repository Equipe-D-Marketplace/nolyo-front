"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../dashboard.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(saved);
  }, []);

  const handleDelete = (id: string) => {
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(filtered));
    setProducts(filtered);
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Produits</h1>

      <Link href="/add-product/new" className={styles.addButton}>
        ➕ Ajouter un produit
      </Link>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix (€)</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td className={styles.actions}>
                <Link href={`/add-product/${p.id}`}>Voir</Link>
                <Link href={`/add-product/edit/${p.id}`}>Modifier</Link>
                <button onClick={() => handleDelete(p.id)}>Suppr</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

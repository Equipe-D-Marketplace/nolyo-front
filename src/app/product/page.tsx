"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

export default function MesProduits() {
  const [products, setProducts] = useState([
    { name: "iPhone X", price: 999 },
    { name: "Pull noir", price: 45 },
  ]);

  return (
    <>
      <h1 className={styles.pageTitle}>Mes Produits</h1>

      <div className={styles.tableCard}>
        {products.map((p, i) => (
          <div key={i} className={styles.row}>
            <strong>{p.name}</strong> – {p.price}€
          </div>
        ))}
      </div>
    </>
  );
}

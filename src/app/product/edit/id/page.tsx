"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../../dashboard.module.css";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({ name: "", price: "" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products") || "[]");
    const p = saved.find((x: any) => x.id === id);

    if (p) setForm({ name: p.name, price: p.price });
  }, [id]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const saved = JSON.parse(localStorage.getItem("products") || "[]");

    const updated = saved.map((p: any) =>
      p.id === id ? { ...p, ...form } : p
    );

    localStorage.setItem("products", JSON.stringify(updated));
    router.push("/product");
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Modifier le produit</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Nom du produit</label>
        <input
          className={styles.input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Prix (€)</label>
        <input
          className={styles.input}
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <button className={styles.submit}>Mettre à jour</button>
      </form>
    </>
  );
}
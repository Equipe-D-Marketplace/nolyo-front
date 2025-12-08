"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addProduct } from "../../lib/products";
import Button from "@/components/Button";

export default function AddProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    imageUrl: "",
    sellerId: "",
    categoryId: "",
  });

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const product = {
      id: crypto.randomUUID(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || form.imageUrl,
      category: form.categoryId || "Autre",
      status: "Actif",
      createdAt: new Date().toISOString().split("T")[0], // "2025-12-08"
      sellerId: form.sellerId,
    };

    addProduct(product);
    router.push("/product");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginTop: "40px",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "25px", fontSize: "1.5rem", fontWeight: "600" }}>
          Ajouter un produit
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            placeholder="Nom du produit"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />

          <textarea
            placeholder="Description du produit"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="input"
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: "80px",
            }}
          />

          <input
            placeholder="Prix (€)"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input"
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />

          <input
            placeholder="Stock disponible"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="input"
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />

          <input
            placeholder="URL de l'image (optionnel)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="input"
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />

          <input
            placeholder="ID du vendeur"
            value={form.sellerId}
            onChange={(e) => setForm({ ...form, sellerId: e.target.value })}
            className="input"
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />

          <input
            placeholder="ID de la catégorie"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="input"
            style={{
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />

          {/* IMAGE UPLOAD */}
          <div
            style={{
              padding: "15px",
              border: "1px dashed #aaa",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <p style={{ marginBottom: "10px", fontSize: "0.875rem" }}>Uploader une image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: "pointer", color: "#4f95fc", fontWeight: "500" }}>
              Choisir un fichier
            </label>
          </div>

          {form.image && (
            <img
              src={form.image}
              width={150}
              height={150}
              style={{
                borderRadius: "8px",
                margin: "auto",
                marginTop: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          )}

          <Button
            label="Ajouter le produit"
            type="submit"
            classNames={["btn_primary", "large"]}
            style={{ marginTop: "20px" }}
          />

          {/* COPYRIGHT */}
          <p
            style={{
              textAlign: "center",
              marginTop: "25px",
              fontSize: "0.75rem",
              opacity: "0.6",
            }}
          >
            © {new Date().getFullYear()} — Tous droits réservés
          </p>
        </form>
      </div>
    </div>
  );
}
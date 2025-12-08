"use client";

import { useEffect, useState } from "react";
import styles from "./product.module.scss";
import { fetchRestApi } from "@/utils/utils";
import { useParams } from "next/navigation";
import Button from "@/components/Button"
import { useCart } from "@/context/CartContext";
export default function ProductPage() {
  
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    const load = async () => {
      const res = await fetchRestApi(`products/${id}`, "GET");
      console.log(res)
      setProduct(res.data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleClick = () => {
    console.log("click")
  }

  const handleAddCartClick = () => {
    if (!product) return;
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    openCart();
  };

  if (loading) return <p>Chargement...</p>;

  if (!product) return <p>Aucun produit trouvé.</p>;

  const imageSrc = product.imageUrl && product.imageUrl.trim() !== ""
    ? product.imageUrl
    : null;

  return (
    <main className={styles.container}>

      {/* IMAGE */}
      <div className={styles.imageWrapper}>
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}></div>
        )}
      </div>

      {/* INFOS PRODUIT */}
      <div className={styles.info}>
        <h1 className={styles.title}>{product.name}</h1>

        <p className={styles.description}>{product.description}</p>

        <p className={styles.price}>{product.price} €</p>

        <p className={styles.stock}>
          Stock : <strong>{product.stock}</strong>
        </p>

        <p className={styles.category}>
          Catégorie : <strong>{product.category?.name}</strong>
        </p>

        <p className={styles.seller}>
          Vendu par : <strong>{product.seller?.company}</strong>
        </p>
        <Button
            label="Acheter"
            classNames={["btn_primary", "small"]}
            type="button"
            handleClick={handleClick}
          />
        <Button
            label="Ajouter au panier"
            classNames={["btn_primary", "small"]}
            type="button"
            handleClick={handleAddCartClick}
          />
      </div>

    </main>
  );
}

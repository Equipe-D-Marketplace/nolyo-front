"use client";

import { getProduct } from "../../lib/products";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  const product = getProduct(id as string);

  if (!product) return <p>Produit introuvable.</p>;

  return (
    <div>
      <h1>{product.name}</h1>

      <img
        src={product.image}
        width={200}
        style={{ borderRadius: 8, marginBottom: 20 }}
      />

      <p><strong>Prix :</strong> {product.price} €</p>
      <p>{product.description}</p>

      <Button
        type="button"
        label="Modifier"
        classNames={["btn_primary", "medium"]}
        handleClick={() => router.push(`/product/edit/${product.id}`)}
      />
    </div>
  );
}

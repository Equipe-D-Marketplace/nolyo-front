import React, { useState } from "react";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import styles from "./catalogue.module.scss";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export type CatalogueProduct = ProductCardProps;

type CatalogueProps = {
  products: CatalogueProduct[];
  className?: string;
  onProductClick?: (id?: string) => void;
  onAddToCart?: (id?: string) => void;
  itemsPerPage?: number;
};

const Catalogue: React.FC<CatalogueProps> = ({
  products,
  itemsPerPage = 9,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { addItem } = useCart();

  if (!products || products.length === 0) {
    return <p className={styles.empty}>Aucun produit à afficher.</p>;
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(start, start + itemsPerPage);

  const handleCardClick = (id?: string) => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = (id?: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    addItem({
      id: product.id || "",
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <section className={styles.catalogue}>
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            category={product.category}
            onCardClick={handleCardClick}
            onAddToCart={handleAddToCart}
            className={styles.item}
          />
        ))}
      </section>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </>
  );
};

export default Catalogue;

import React from "react";
import Image from "next/image";
import styles from "./productCard.module.scss";

export type ProductCardProps = {
  id?: string;
  name: string;
  price: number;
  category: {
    description: string,
    id: number,
    name: string
  };
  imageUrl: string;
  imageAlt?: string;
  currency?: string;
  onCardClick?: (id?: string) => void;
  onAddToCart?: (id?: string) => void;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  badgeColor?: "primary" | "secondary" | "success" | "warning" | "error";
  className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  category,
  imageUrl,
  imageAlt,
  currency = "€",
  onCardClick,
  onAddToCart,
  originalPrice,
  rating,
  reviewsCount,
  badge,
  badgeColor = "primary",
  className,
}) => {
  const handleCardClick = () => {
    onCardClick?.(id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(id);
  };

  const formatPrice = (amount: number) => {
    return `${amount.toFixed(2)}${currency}`;
  };

  return (
    <div
      className={`${styles.product_card} ${className || ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className={styles.image_container}>
        {/* {imageUrl ?? (
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            width={300}
            height={200}
            className={styles.product_image}
          />
        )
        } */}

        {badge && (
          <div className={`${styles.badge} ${styles[`badge_${badgeColor}`]}`}>
            {badge}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.category}>{category.name}</div>

        <h3 className={styles.product_name}>{name}</h3>

        <div className={styles.price_container}>
          <span className={styles.current_price}>{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className={styles.original_price}>
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {rating && (
          <div className={styles.rating}>
            <span className={styles.stars}>
              {"★".repeat(Math.floor(rating))}
              {"☆".repeat(5 - Math.floor(rating))}
            </span>
            <span className={styles.rating_text}>
              {rating.toFixed(1)} ({reviewsCount || 0} avis)
            </span>
          </div>
        )}

        {onAddToCart && (
          <button
            className={styles.add_to_cart}
            onClick={handleAddToCart}
            aria-label={`Ajouter ${name} au panier`}
          >
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

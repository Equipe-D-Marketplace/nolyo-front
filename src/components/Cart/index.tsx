import React from "react";
import styles from "./cart.module.scss";
import Button from "@/components/Button";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartProps = {
  isOpen: boolean;
  items: CartItem[];
  currency?: string;
  onClose: () => void;
  onCheckout: () => void;
  onRemoveItem?: (id: string) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
};

const CartSidebar: React.FC<CartProps> = ({
  isOpen,
  items,
  currency = "€",
  onClose,
  onCheckout,
  onRemoveItem,
  onQuantityChange,
}) => {
  const updateQuantity = (id: string, delta: number) => {
    if (!onQuantityChange) return;
    const current = items.find((item) => item.id === id)?.quantity ?? 1;
    const next = Math.max(1, current + delta);
    onQuantityChange(id, next);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.drawer_open : ""}`}>
      <div className={styles.backdrop} onClick={onClose} />

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebar_open : ""}`}
        aria-label="Panier"
      >
        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>Panier</p>
            <h2 className={styles.title}>Vos articles</h2>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </header>

        <div className={styles.content}>
          {items.length === 0 ? (
            <p className={styles.empty}>Votre panier est vide.</p>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={styles.thumbnail}
                    />
                  ) : (
                    <div className={styles.placeholder} aria-hidden />
                  )}

                  <div className={styles.details}>
                    <div className={styles.row}>
                      <span className={styles.name}>{item.name}</span>
                      <span className={styles.price}>
                        {(item.price * item.quantity).toFixed(2)}
                        {currency}
                      </span>
                    </div>

                    <div className={styles.controls}>
                      <div className={styles.quantity}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Diminuer la quantité"
                        >
                          –
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      {onRemoveItem && (
                        <button
                          className={styles.remove}
                          onClick={() => onRemoveItem(item.id)}
                        >
                          Retirer
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className={styles.footer}>
          <div className={styles.total}>
            <span>Total</span>
            <strong>
              {total.toFixed(2)}
              {currency}
            </strong>
          </div>

          <Button
            label="Payer"
            type="button"
            handleClick={onCheckout}
            classNames={["btn_primary", "btn_large", "with_icon"]}
            disabled={items.length === 0}
          />
        </footer>
      </aside>
    </div>
  );
};

export default CartSidebar;
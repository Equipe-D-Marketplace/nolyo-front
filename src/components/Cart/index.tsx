import React, { useState } from "react";
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
  addresses?: {
    id: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }[];
  selectedAddressId?: string | null;
  onSelectAddress?: (id: string) => void;
  onCreateAddress?: (addr: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }) => void;
};

const CartSidebar: React.FC<CartProps> = ({
  isOpen,
  items,
  currency = "€",
  onClose,
  onCheckout,
  onRemoveItem,
  onQuantityChange,
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onCreateAddress,
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

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

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectAddress?.(e.target.value);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.postalCode || !addressForm.country) return;
    onCreateAddress?.(addressForm);
    setShowAddressForm(false);
    setAddressForm({ street: "", city: "", postalCode: "", country: "" });
  };

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
          <div className={styles.address_block}>
            <div className={styles.address_header}>
              <span>Adresse de livraison</span>
              {addresses.length === 0 && (
                <span className={styles.address_hint}>Aucune adresse enregistrée</span>
              )}
            </div>

            {addresses.length > 0 && (
              <select
                className={styles.address_select}
                value={selectedAddressId ?? ""}
                onChange={handleAddressSelect}
              >
                <option value="" disabled>
                  Sélectionnez une adresse
                </option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street}, {addr.postalCode} {addr.city}, {addr.country}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              className={styles.address_add}
              onClick={() => setShowAddressForm((prev) => !prev)}
            >
              {showAddressForm ? "Annuler" : "Ajouter une adresse"}
            </button>

            {showAddressForm && (
              <form className={styles.address_form} onSubmit={handleAddressSubmit}>
                <input
                  type="text"
                  placeholder="Rue"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Code postal"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Pays"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))}
                  required
                />
                <Button
                  label="Enregistrer"
                  type="submit"
                  classNames={["btn_primary", "btn_small"]}
                />
              </form>
            )}
          </div>

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
            disabled={items.length === 0 || !selectedAddressId}
          />
        </footer>
      </aside>
    </div>
  );
};

export default CartSidebar;
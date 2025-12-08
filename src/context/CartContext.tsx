"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import CartSidebar, { CartItem } from "@/components/Cart";
import { fetchRestApi } from "@/utils/utils";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const syncCart = async (cartItems: CartItem[]) => {
    try {
      const payload = {
        items: cartItems
          .map(({ id, quantity }) => ({
            productId: Number(id),
            quantity,
          }))
          .filter(({ productId }) => !Number.isNaN(productId)),
      };

      const response = await fetchRestApi("cart/add", "POST", payload);
      console.log("[Cart] Synchronisation API envoyée", payload, response);
    } catch (error) {
      console.error("[Cart] Erreur lors de la synchro panier", error);
    }
  };

  const addItem = (item: CartItem) => {
    console.log("[Cart] Ajout au panier demandé", item);

    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      const nextItems = existing
        ? prev.map((p) =>
            p.id === item.id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          )
        : [...prev, item];

      void syncCart(nextItems);
      return nextItems;
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value: CartContextValue = {
    items,
    isOpen,
    totalCount,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartSidebar
        isOpen={isOpen}
        items={items}
        onClose={closeCart}
        onCheckout={() => console.log("Paiement déclenché")}
        onRemoveItem={removeItem}
        onQuantityChange={updateQuantity}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé dans CartProvider");
  }
  return ctx;
};


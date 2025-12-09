"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CartSidebar, { CartItem } from "@/components/Cart";
import Toast from "@/components/Toast";
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
  checkout: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<
    { message: string; type: "success" | "error" | "info" } | null
  >(null);
  const cartCreatedRef = useRef(false);
  const lastSyncSignatureRef = useRef<string | null>(null);
  const lastSyncAtRef = useRef<number>(0);
  const checkoutInFlightRef = useRef(false);

  const getToken = () => {
    if (typeof document === "undefined") return null;
    const tokenCookie = document.cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="));
    return tokenCookie?.split("=")[1] || null;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const loadCart = async () => {
      try {
        const response = await fetchRestApi("cart", "GET", undefined, {
          Authorization: `Bearer ${token}`,
        });

        // Le backend renvoie `data.panier` (tableau). On prend le plus récent.
        const carts = response?.data?.panier;
        const latestCart =
          Array.isArray(carts) && carts.length > 0
            ? carts
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || 0).getTime() -
                    new Date(a.createdAt || 0).getTime()
                )[0]
            : null;

        const apiItems = latestCart?.items || [];

        const mapped: CartItem[] = (Array.isArray(apiItems) ? apiItems : []).map(
          (item: any) => ({
            id: String(item.productId || item.product?.id || item.id || ""),
            name: item.product?.name || item.name || "",
            price: Number(item.product?.price ?? item.price ?? 0),
            quantity: Number(item.quantity ?? 1),
            imageUrl: item.product?.imageUrl || item.imageUrl,
          })
        );

        setItems(mapped.filter((p) => p.id));
        if (mapped.length > 0) {
          cartCreatedRef.current = true;
        }
      } catch (error) {
        console.error("[Cart] Erreur lors du chargement du panier", error);
        setToast({
          message: "Impossible de charger votre panier.",
          type: "error",
        });
      }
    };

    void loadCart();
  }, []);

  const syncCart = async (cartItems: CartItem[], token: string) => {
    try {
      const payload = {
        items: cartItems
          .map(({ id, quantity }) => ({
            productId: Number(id),
            quantity,
          }))
          .filter(({ productId }) => !Number.isNaN(productId)),
      };

      const signature = JSON.stringify(payload);
      const now = Date.now();
      if (
        lastSyncSignatureRef.current === signature &&
        now - lastSyncAtRef.current < 800
      ) {
        console.log("[Cart] Sync ignorée (doublon rapide)");
        return;
      }
      lastSyncSignatureRef.current = signature;
      lastSyncAtRef.current = now;

      const response = await fetchRestApi("cart/add", "POST", payload, {
        Authorization: `Bearer ${token}`,
      });
      console.log("[Cart] Synchronisation API envoyée", payload, response);
    } catch (error) {
      console.error("[Cart] Erreur lors de la synchro panier", error);
      setToast({
        message: "Impossible de synchroniser le panier.",
        type: "error",
      });
    }
  };

  const addItem = (item: CartItem) => {
    const token = getToken();
    if (!token) {
      setToast({
        message: "Veuillez vous connecter pour ajouter un article au panier.",
        type: "error",
      });
      setIsOpen(false);
      return;
    }

    console.log("[Cart] Ajout au panier demandé", item);

    setItems((prev) => {
      const isFirstItem = prev.length === 0 && !cartCreatedRef.current;
      const existing = prev.find((p) => p.id === item.id);
      const nextItems = existing
        ? prev.map((p) =>
            p.id === item.id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          )
        : [...prev, item];

      if (isFirstItem) {
        void syncCart(nextItems, token);
        cartCreatedRef.current = true;
      } else if (cartCreatedRef.current) {
        void syncCart(nextItems, token);
      }

      return nextItems;
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    const token = getToken();
    if (!token) {
      setToast({
        message: "Veuillez vous connecter pour modifier votre panier.",
        type: "error",
      });
      return;
    }

    setItems((prev) => {
      const nextItems = prev.map((p) =>
        p.id === id ? { ...p, quantity } : p
      );

      if (cartCreatedRef.current) {
        void syncCart(nextItems, token);
      }

      return nextItems;
    });
  };

  const checkout = async () => {
    const token = getToken();
    if (!token) {
      setToast({
        message: "Veuillez vous connecter pour payer votre panier.",
        type: "error",
      });
      return;
    }

    if (checkoutInFlightRef.current) return;
    checkoutInFlightRef.current = true;

    try {
      const payload = {
        products: items.map(({ id, quantity }) => ({
          productId: Number(id),
          quantity,
        })),
      };

      const response = await fetchRestApi(
        "order/session",
        "POST",
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const url =
        response?.data ||
        response?.sessionUrl ||
        response?.url ||
        null;

      if (!url || typeof url !== "string") {
        throw new Error("Impossible de récupérer l'URL de paiement.");
      }

      window.location.href = url;
    } catch (error: any) {
      console.error("[Cart] Erreur lors du paiement", error);
      setToast({
        message: error?.message || "Le paiement a échoué.",
        type: "error",
      });
    } finally {
      checkoutInFlightRef.current = false;
    }
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
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartSidebar
        isOpen={isOpen}
        items={items}
        onClose={closeCart}
        onCheckout={checkout}
        onRemoveItem={removeItem}
        onQuantityChange={updateQuantity}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="top-right"
        />
      )}
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


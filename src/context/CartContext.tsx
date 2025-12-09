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
  addresses: Address[];
  selectedAddressId: string | null;
  selectAddress: (id: string) => void;
  createAddress: (addr: NewAddressPayload) => Promise<void>;
};

type Address = {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

type NewAddressPayload = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const cartCreatedRef = useRef(false);
  const lastSyncSignatureRef = useRef<string | null>(null);
  const lastSyncAtRef = useRef<number>(0);
  const checkoutInFlightRef = useRef(false);
  const cartIdRef = useRef<string | null>(null);

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

        if (latestCart?.id) {
          cartIdRef.current = String(latestCart.id);
        }

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

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const loadAddresses = async () => {
      try {
        const response = await fetchRestApi("address/", "GET", undefined, {
          Authorization: `Bearer ${token}`,
        });

        const list =
          response?.data?.data ||
          response?.data?.addresses ||
          response?.data ||
          response ||
          [];

        const mapped: Address[] = (Array.isArray(list) ? list : []).map(
          (addr: any) => ({
            id: String(addr.id ?? ""),
            street: addr.street ?? "",
            city: addr.city ?? "",
            postalCode: addr.postalCode ?? "",
            country: addr.country ?? "",
            isDefault: !!addr.isDefault,
          })
        );

        setAddresses(mapped);
        if (mapped.length > 0) {
          const defaultAddr =
            mapped.find((a) => a.isDefault) ?? mapped[0];
          setSelectedAddressId(defaultAddr.id);
        } else {
          setSelectedAddressId(null);
        }
      } catch (error) {
        console.error("[Cart] Erreur lors du chargement des adresses", error);
        setToast({
          message: "Impossible de charger vos adresses.",
          type: "error",
        });
      }
    };

    void loadAddresses();
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
        cartId: cartIdRef.current ? Number(cartIdRef.current) : undefined,
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

      const returnedId =
        response?.data?.id ||
        response?.data?.cartId ||
        response?.cartId ||
        response?.id;
      if (returnedId) {
        cartIdRef.current = String(returnedId);
      }
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

    if (!selectedAddressId) {
      setToast({
        message: "Veuillez sélectionner une adresse avant de payer.",
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
        cartId: cartIdRef.current ? Number(cartIdRef.current) : undefined,
        addressId: Number(selectedAddressId),
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

  const selectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const createAddress = async (addr: NewAddressPayload) => {
    const token = getToken();
    if (!token) {
      setToast({
        message: "Veuillez vous connecter pour ajouter une adresse.",
        type: "error",
      });
      return;
    }
    try {
      const response = await fetchRestApi("address/add", "POST", addr, {
        Authorization: `Bearer ${token}`,
      });

      const created =
        response?.data?.data ||
        response?.data ||
        response ||
        null;

      if (!created?.id) {
        throw new Error("Adresse non créée.");
      }

      const newAddr: Address = {
        id: String(created.id),
        street: created.street ?? addr.street,
        city: created.city ?? addr.city,
        postalCode: created.postalCode ?? addr.postalCode,
        country: created.country ?? addr.country,
        isDefault: !!created.isDefault,
      };

      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      setToast({ message: "Adresse ajoutée.", type: "success" });
    } catch (error) {
      console.error("[Cart] Erreur lors de l'ajout d'adresse", error);
      setToast({
        message: "Impossible d'ajouter l'adresse.",
        type: "error",
      });
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
    addresses,
    selectedAddressId,
    selectAddress,
    createAddress,
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
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={selectAddress}
        onCreateAddress={createAddress}
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


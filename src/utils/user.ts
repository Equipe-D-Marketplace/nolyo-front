// lib/user.ts
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: "Livré" | "En cours" | "Annulé";
  items: OrderItem[];
};

const USER_KEY = "user";
const ORDERS_KEY = "orders";

// Récupérer l'utilisateur
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

// Récupérer les commandes
export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Simuler une commande (à remplacer par votre logique)
export const createOrder = (items: OrderItem[]): void => {
  const orders = getOrders();
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "En cours",
    items,
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...orders]));
};
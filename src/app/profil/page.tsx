// app/profil/page.tsx
"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSeller } from "@/utils/seller";
import Button from "@/components/Button";
import styles from "../dashboard.module.css";
import Cookies from "js-cookie";


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  product: Product;
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function SellerProfilePage() {
  const router = useRouter();
  const [seller, setSeller] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const decodedUser: any = jwtDecode(token);
        const userId = decodedUser.userId || decodedUser.id;

        if (!userId) {
          console.error("No user ID found in token");
          return;
        }

        const response = await fetch(`https://nolyo-back.onrender.com/api/auth/profile/id?id=${userId}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        const data = await response.json();
        setSeller(data.data || data);

      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/");
      }
    };

    const fetchOrders = async () => {
      try {
        const decodedUser: any = jwtDecode(token);
        const userId = decodedUser.userId || decodedUser.id;

        const response = await fetch(`https://nolyo-back.onrender.com/api/order/orderbyclient/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        const data = await response.json();
        console.log("orders data", data);
        // User indicates response structure is { data: [...] } or potentially just [...] based on previous context, 
        // but user specifically pasted "data": [...] which usually implies a wrapper.
        // We handle both just in case:
        if (data.data && Array.isArray(data.data)) {
          setOrders(data.data);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("Unexpected orders data structure", data);
          setOrders([]);
        }

      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [router]);

  const handleLogout = () => {
    clearSeller();
    Cookies.remove("token");
    router.push("/");
  };

  if (!seller) return null;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mon profil</h1>

      <div className={styles.profileCard}>
        <section>
          <h2>Informations du compte</h2>
          <p><strong>Nom d'utilisateur :</strong> {seller.username}</p>
          <p><strong>Email :</strong> {seller.email}</p>
          {seller.company && <p><strong>Entreprise :</strong> {seller.company}</p>}
          {seller.phone && <p><strong>Téléphone :</strong> {seller.phone}</p>}
        </section>

        <section className={styles.ordersSection}>
          <h2>Mes Commandes</h2>
          <div className={styles.ordersList}>
            {orders.length === 0 ? (
              <p>Aucune commande trouvée.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span><strong>Commande #{order.id}</strong></span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className={styles.status}>{order.status}</span>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.orderItemRow}>
                        <span>{item.quantity}x {item.product.name}</span>
                        <span>{item.unitPrice} €</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderTotal}>
                    <strong>Total: {order.totalAmount} €</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <Button
            label="Modifier le profil"
            type="button"
            classNames={["btn_secondary", "medium"]}
            disabled
            title="Fonctionnalité à venir"
          />
          <Button
            label="Se déconnecter"
            type="button"
            classNames={["btn_logout", "medium"]}
            handleClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
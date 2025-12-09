// app/profil/page.tsx
"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSeller } from "@/utils/seller";
import Button from "@/components/Button";
import styles from "../dashboard.module.css";
import Cookies from "js-cookie";


export default function SellerProfilePage() {
  const router = useRouter();
  const [seller, setSeller] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      // Redirige vers une page qui existe (ex: accueil)
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const decodedUser: any = jwtDecode(token);
        const userId = decodedUser.userId || decodedUser.id; // Adjust based on actual token payload

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
        console.log("data", data);
        // Assuming the API returns the user object in data.data or directly in data
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
        setOrders(data);
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
    router.push("/"); // Redirige vers l'accueil après déconnexion
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
        <section>
          <h2>Commandes</h2>
          <div className={styles.ordersList}>
            {orders.length === 0 ? (
              <p>Aucune commande trouvée.</p>
            ) : (
              orders.map((order: any, index: number) => (
                <div key={index} className={styles.orderCard}>
                  <p><strong>Commande date : </strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total :</strong> {order.totalAmount} €</p>
                  <p><strong>Status :</strong> {order.status}</p>
                  {/* Add more order details as needed */}
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
// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, getOrders, Order } from "@/utils/user";
import Button from "@/components/Button";
import styles from "../dashboard.module.css";

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setUser(getUser());
    setOrders(getOrders());
  }, []);

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Accès non autorisé</h1>
        <p>Vous devez être connecté pour accéder à votre dashboard.</p>
        <Link href="/auth/login">
          <Button label="Se connecter" type="button" classNames={["btn_primary", "medium"]} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Bonjour, {user.name} !</h1>

      {/* Profil */}
      <div className={styles.profileCard}>
        <h2>Votre profil</h2>
        <p><strong>Nom :</strong> {user.name}</p>
        <p><strong>Email :</strong> {user.email}</p>
        {user.phone && <p><strong>Téléphone :</strong> {user.phone}</p>}
        <Link href="/dashboard/profil">
          <Button
            label="Modifier mon profil"
            type="button"
            classNames={["btn_secondary", "small"]}
          />
        </Link>
      </div>

      {/* Statistiques */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>📦</div>
          <div>
            <div className={styles.statLabel}>Commandes totales</div>
            <div className={styles.statValue}>{orders.length}</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div>💰</div>
          <div>
            <div className={styles.statLabel}>Dépenses totales</div>
            <div className={styles.statValue}>
              {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)} €
            </div>
          </div>
        </div>
      </div>

      {/* Historique des commandes */}
      <div className={styles.tableCard}>
        <h2>Historique des commandes</h2>

        {orders.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Commande</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.total.toFixed(2)} €</td>
                  <td>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "12px",
                        background:
                          order.status === "Livré"
                            ? "#E7F8EA"
                            : order.status === "En cours"
                            ? "#FFF3CD"
                            : "#FCE8E6",
                        color:
                          order.status === "Livré"
                            ? "#2E7D32"
                            : order.status === "En cours"
                            ? "#856404"
                            : "#B71C1C",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/dashboard/order/${order.id}`}>
                      <Button
                        label="Détails"
                        type="button"
                        classNames={["btn_primary", "small"]}
                      />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
            Vous n'avez pas encore passé de commande.
          </p>
        )}
      </div>
    </div>
  );
}
// app/sales/order/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Button from "@/components/Button";
import styles from "../../../dashboard.module.css";

export default function OrderDetailPage() {
  const { id } = useParams();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Détail de la commande {id}</h1>
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <p>Commande ID : {id}</p>
        <p>Statut : Livré</p>
        <p>Montant : 89.99 €</p>
        <p>Client : Alice Martin</p>
        <p>Date : 2025-04-01</p>
        <div style={{ marginTop: "20px" }}>
          <Button
            label="Retour"
            type="button"
            classNames={["btn_secondary", "medium"]}
            handleClick={() => window.history.back()}
          />
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Données du graphique (vous pouvez les dynamiser plus tard)
const salesData = [
  { name: "Lun", ventes: 140 },
  { name: "Mar", ventes: 200 },
  { name: "Mer", ventes: 180 },
  { name: "Jeu", ventes: 240 },
  { name: "Ven", ventes: 280 },
  { name: "Sam", ventes: 250 },
  { name: "Dim", ventes: 300 },
];

// Type pour les produits
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  status: "Actif" | "Inactif";
  createdAt: string; // format YYYY-MM-DD
};

const DashboardVendeur = () => {
  const router = useRouter();
  const [period, setPeriod] = useState("7 jours");
  const [products, setProducts] = useState<Product[]>([]);

  // Charger les produits depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // On assume que le statut est "Actif" par défaut si non présent
        const withStatus = parsed.map((p: any) => ({
          ...p,
          status: p.status || "Actif",
          category: p.category || p.categorie || "Autre", // compatibilité
          price: typeof p.price === "string" ? parseFloat(p.price.replace("€", "")) : p.price,
        }));
        setProducts(withStatus);
      } catch (e) {
        console.error("Erreur lors du chargement des produits", e);
        setProducts([]);
      }
    }
  }, []);

  const handleAddProduct = () => {
    router.push("/product/new");
  };

  return (
    <div style={styles.layout}>
      {/* ---- SIDEBAR ---- */}
      <aside style={styles.sidebar}>
        <nav style={styles.menu}>
          <Link style={styles.menuItem} href="/dashboard">
            📊 Tableau de bord
          </Link>
          <Link style={styles.menuItem} href="/product">
            📦 Mes produits
          </Link>
          <Link style={styles.menuItem} href="/product/new">
            ➕ Ajouter un produit
          </Link>
          <Link style={styles.menuItem} href="/sales">
            🛒 Mes ventes
          </Link>
          <Link style={styles.menuItem} href="/profil">
            👤 Profil
          </Link>
        </nav>

        <div style={styles.settings}>
          <span style={{ color: "#888" }}>⚙️ Paramètres</span>
        </div>
      </aside>

      {/* ---- CONTENU ---- */}
      <main style={styles.content}>
        <h1 style={styles.pageTitle}>Tableau de bord vendeur</h1>

        {/* Cartes statistiques */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            💵
            <div style={styles.statLabel}>Ventes Totales</div>
            <div style={styles.statValue}>${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</div>
          </div>

          <div style={styles.statCard}>
            📦
            <div style={styles.statLabel}>Produits Actifs</div>
            <div style={styles.statValue}>
              {products.filter((p) => p.status === "Actif").length}
            </div>
          </div>

          <div style={styles.statCard}>
            📈
            <div style={styles.statLabel}>Nouvelles Commandes</div>
            <div style={styles.statValue}>0</div>
          </div>
        </div>

        {/* GRAPH */}
        <div style={styles.graphCard}>
          <div style={styles.graphHeader}>
            <h2 style={styles.graphTitle}>Performance des ventes</h2>
            <select
              style={styles.select}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Derniers 7 jours</option>
              <option>30 jours</option>
              <option>3 mois</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ventes"
                stroke="#4C7DFF"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE PRODUITS */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.graphTitle}>Mes produits</h2>
            <button onClick={handleAddProduct} style={styles.addButton}>
              + Ajouter un produit
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>NOM DU PRODUIT</th>
                <th>CATÉGORIE</th>
                <th>PRIX</th>
                <th>STATUT</th>
                <th>AJOUTÉ LE</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Image
                        src={p.image || "/placeholder.png"}
                        alt={p.name}
                        width={50}
                        height={50}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.price.toFixed(2)} €</td>
                    <td>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: "12px",
                          background: p.status === "Actif" ? "#E7F8EA" : "#FCE8E6",
                          color: p.status === "Actif" ? "#2E7D32" : "#B71C1C",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>{p.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    Aucun produit trouvé. Cliquez sur “Ajouter un produit” pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <p>© 2025 Nolyo · Entreprise · Support · Légal</p>
        </footer>
      </main>
    </div>
  );
};

// ---- STYLES (inchangés, ou presque) ----
const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    background: "#F7F8FA",
    minHeight: "100vh",
  },
  sidebar: {
    width: "250px",
    background: "#ffffff",
    padding: "25px 20px",
    borderRight: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  menuItem: {
    fontSize: "15px",
    color: "#444",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 8,
    background: "#f4f6fb",
  },
  settings: {
    marginTop: "auto",
    paddingTop: "20px",
    fontSize: "14px",
  },
  content: {
    flex: 1,
    padding: "40px 50px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "25px",
  },
  statsGrid: {
    display: "flex",
    gap: "20px",
    marginBottom: "35px",
  },
  statCard: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
    fontSize: "14px",
  },
  statLabel: {
    marginTop: 10,
    fontSize: "14px",
    color: "#666",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: 5,
    color: "#222",
  },
  graphCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "35px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  },
  graphHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  select: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  tableCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    alignItems: "center",
  },
  addButton: {
    background: "#4C7DFF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
    color: "#777",
    fontSize: 14,
  },
};

export default DashboardVendeur;
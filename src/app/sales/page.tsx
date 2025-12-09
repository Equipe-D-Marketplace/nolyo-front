"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import Button from "@/components/Button";
import styles from "../dashboard.module.css";

// Données simulées — à remplacer par vos données réelles
const salesData = [
  { name: "Lun", ventes: 140 },
  { name: "Mar", ventes: 200 },
  { name: "Mer", ventes: 180 },
  { name: "Jeu", ventes: 240 },
  { name: "Ven", ventes: 280 },
  { name: "Sam", ventes: 250 },
  { name: "Dim", ventes: 300 },
];

const orderStats = {
  totalRevenue: 12345.67,
  totalOrders: 42,
  avgOrderValue: 293.94,
  conversionRate: 3.2,
};

const recentOrders = [
  { id: "ORD-001", customer: "Alice Martin", date: "2025-04-01", amount: 89.99, status: "Livré" },
  { id: "ORD-002", customer: "Bob Dupont", date: "2025-04-02", amount: 249.99, status: "En cours" },
  { id: "ORD-003", customer: "Claire Dubois", date: "2025-04-03", amount: 45.00, status: "Annulé" },
  { id: "ORD-004", customer: "David Lefebvre", date: "2025-04-04", amount: 199.99, status: "Livré" },
  { id: "ORD-005", customer: "Emma Moreau", date: "2025-04-05", amount: 320.50, status: "En cours" },
];

const COLORS = ["#4C7DFF", "#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0"];

export default function SalesPage() {
  const [period, setPeriod] = useState("7 jours");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Filtrer les commandes
  const filteredOrders = recentOrders.filter((order) => {
    return !statusFilter || order.status === statusFilter;
  });

  return (
    <div className={styles.pageContainer}>
      {/* Titre */}
      <h1 className={styles.pageTitle}>📊 Statistiques des ventes</h1>

      {/* Cartes principales */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "2rem", color: "#4C7DFF" }}>💰</span>
            <div>
              <div className={styles.statLabel}>Chiffre d'affaires</div>
              <div className={styles.statValue}>{orderStats.totalRevenue.toFixed(2)} €</div>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "2rem", color: "#FF6B6B" }}>🛒</span>
            <div>
              <div className={styles.statLabel}>Commandes totales</div>
              <div className={styles.statValue}>{orderStats.totalOrders}</div>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "2rem", color: "#4ECDC4" }}>📈</span>
            <div>
              <div className={styles.statLabel}>Panier moyen</div>
              <div className={styles.statValue}>{orderStats.avgOrderValue.toFixed(2)} €</div>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "2rem", color: "#FFD166" }}>🎯</span>
            <div>
              <div className={styles.statLabel}>Taux de conversion</div>
              <div className={styles.statValue}>{orderStats.conversionRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique principal */}
      <div className={styles.graphCard}>
        <div className={styles.graphHeader}>
          <h2 className={styles.graphTitle}>Ventes sur les 7 derniers jours</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={styles.select}
          >
            <option>7 jours</option>
            <option>30 jours</option>
            <option>3 mois</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
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

      {/* Répartition par statut */}
      <div className={styles.pieCard}>
        <h2 className={styles.graphTitle}>Répartition des commandes</h2>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <PieChart width={400} height={300}>
            <Pie
              data={[
                { name: "Livré", value: 28 },
                { name: "En cours", value: 10 },
                { name: "Annulé", value: 4 },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {[
                { name: "Livré", value: 28, color: "#4ECDC4" },
                { name: "En cours", value: 10, color: "#FFD166" },
                { name: "Annulé", value: 4, color: "#FF6B6B" },
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>Dernières commandes</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
              style={{ minWidth: 150 }}
            >
              <option value="">Tous les statuts</option>
              <option value="Livré">Livré</option>
              <option value="En cours">En cours</option>
              <option value="Annulé">Annulé</option>
            </select>
            <Button
              label="Exporter CSV"
              type="button"
              classNames={["btn_secondary", "small"]}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.amount} €</td>
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
                    <Link href={`/sales/order/${order.id}`}>
                      <Button
                        label="Détails"
                        type="button"
                        classNames={["btn_primary", "small"]}
                      />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                  Aucune commande ne correspond aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (optionnelle) */}
      <div className={styles.pagination}>
        <Button
          label="Précédent"
          type="button"
          classNames={["btn_secondary", "small"]}
          handleClick={() => {}}
          disabled
        />
        <span className={styles.pageInfo}>Page 1 / 1</span>
        <Button
          label="Suivant"
          type="button"
          classNames={["btn_secondary", "small"]}
          handleClick={() => {}}
          disabled
        />
      </div>
    </div>
  );
}
  
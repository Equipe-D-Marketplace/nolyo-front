"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import Cookies from "js-cookie";

const roleMapping: { [key: string]: string } = {
  acheteur: "CLIENT",
  vendeur: "VENDEUR",
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "acheteur",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifications
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setToast({ message: "Tous les champs sont requis", type: "error" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ message: "Les mots de passe ne correspondent pas", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: roleMapping[formData.role],
        isGuest: false,
      };

      console.log("➡️ Données envoyées :", payload);

      const response = await fetch("https://nolyo-back.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // ✅ Si ton backend renvoie un token, on le stocke dans les cookies
      if (data.token) {
        Cookies.set("token", data.token, { expires: 7 }); // valide 7 jours
      }

      setToast({ message: "Inscription réussie 🎉", type: "success" });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error: any) {
      console.error("❌ Erreur API:", error);
      setToast({ message: error.message || "Erreur lors de l’inscription", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <Image src="/Nolyo.png" alt="Nolyo logo" width={200} height={90} />
        </div>

        <h1 style={styles.title}>Créer un compte</h1>
        <p style={styles.subtitle}>Rejoignez la communauté Nolyo</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Input type="text" name="username" label="Nom d'utilisateur" onChange={handleChange} required />
          <Input type="email" name="email" label="Adresse e-mail" onChange={handleChange} required />
          <Input type="password" name="password" label="Mot de passe" onChange={handleChange} required />
          <Input
            type="password"
            name="confirmPassword"
            label="Confirmer le mot de passe"
            onChange={handleChange}
            required
          />

          <div style={styles.roleContainer}>
            <span style={styles.roleLabel}>Votre rôle</span>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="acheteur"
                  checked={formData.role === "acheteur"}
                  onChange={handleChange}
                />
                <span style={styles.radioText}>Acheteur</span>
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="vendeur"
                  checked={formData.role === "vendeur"}
                  onChange={handleChange}
                />
                <span style={styles.radioText}>Vendeur</span>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              label={loading ? "Création..." : "Créer un compte"}
              classNames={["btn_primary", "btn_medium"]}
            />
          </div>
        </form>

        <p style={styles.footerText}>
          Déjà inscrit ?{" "}
          <Link href="/auth/login" style={styles.link}>
            Se connecter
          </Link>
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  logoContainer: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "20px",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  roleContainer: {
    marginTop: "15px",
    textAlign: "left",
  },
  roleLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "center",
  },
  radioGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  radioText: {
    fontSize: "14px",
    color: "#333",
  },
  footerText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#0070f3",
    textDecoration: "none",
  },
};

export default Register;

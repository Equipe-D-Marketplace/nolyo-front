"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Toast from "@/components/Toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setToast({ message: "Veuillez remplir tous les champs", type: "error" });
      return;
    }

    if (formData.email === "test@test.com" && formData.password === "1234") {
      setToast({ message: "Connexion réussie 👋", type: "success" });
    } else {
      setToast({ message: "Identifiants invalides", type: "error" });
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <Image
            src="/Nolyo.png"
            alt="Nolyo logo"
            width={200}
            height={90}
            style={{ marginBottom: "10px" }}
          />
        </div>

        <h1 style={styles.title}>Bienvenue</h1>
        <p style={styles.subtitle}>Connectez-vous à votre compte</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Input
            type="email"
            name="email"
            label="Email"
            required
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            label="Mot de passe"
            required
            onChange={handleChange}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            label="Connexion"
            classNames={["btn_primary", "btn_medium"]}
          />
          </div>
          
        </form>

        <p style={styles.footerText}>
          Pas encore de compte ? <Link href="/register" style={styles.link}>Créer un compte</Link>
        </p>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9fafc",
    position: "relative",
  },
  card: {
    width: "380px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "35px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center" as const,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "18px",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
    fontWeight: 500,
  },
};

export default Login;

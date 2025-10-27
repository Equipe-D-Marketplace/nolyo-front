"use client";
import React, { useState } from "react";
import Input from "../../components/Input";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "acheteur",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données du formulaire :", formData);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.title}>Créer un compte</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Adresse email */}
          <Input
            type="email"
            name="email"
            label="Adresse e-mail"
            placeholder="votre.email@exemple.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Mot de passe */}
          <Input
            type="password"
            name="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Rôle */}
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

          {/* Bouton */}
          <button type="submit" style={styles.button}>
            Créer un compte
          </button>
        </form>
      </div>
    </div>
  );
};

// ---------- STYLES ----------
const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
  },
  card: {
    width: "380px",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #eaeaea",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "25px",
    textAlign: "left" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  roleContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  roleLabel: {
    fontWeight: "500",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  radioText: {
    fontSize: "15px",
  },
  button: {
    marginTop: "10px",
    width: "100%",
    padding: "12px 0",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Register;

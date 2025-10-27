"use client";
import React, { useState } from "react";
import Input from "../../components/Input";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        <h1 style={styles.title}>Se connecter</h1>
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
          <button type="submit" style={styles.button}>Connexion</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    maxWidth: "400px",
    width: "100%",
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login;
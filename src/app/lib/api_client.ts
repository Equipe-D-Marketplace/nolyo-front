// src/lib/api_client.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://nolyo-back.onrender.com/api/", // ton backend en prod
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionnel : ajouter le token automatiquement si connecté
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

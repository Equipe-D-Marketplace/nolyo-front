// /src/lib/api_client.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nolyo.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

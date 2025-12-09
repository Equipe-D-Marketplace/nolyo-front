// lib/seller.ts
import { jwtDecode } from "jwt-decode";
export type Seller = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
};
interface MyJwtPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}
const SELLER_KEY = "seller";

export const getSeller = (): MyJwtPayload | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("token");
  if (!data) return null;
  const decoded = jwtDecode<MyJwtPayload>(data);
  console.log("decoded", decoded);

  return decoded;
};

export const setSeller = (seller: Seller): void => {
  localStorage.setItem("token", JSON.stringify(seller));
};

export const clearSeller = (): void => {
  localStorage.removeItem("token");
};
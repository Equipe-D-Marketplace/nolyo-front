import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
interface MyJwtPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  console.log("token", token);
  let role = "";
  let decoded: MyJwtPayload | null =  null;
  if (token) {
    try {
      decoded = jwtDecode<MyJwtPayload>(token);
      role = decoded?.role || "";
      console.log("role", role);
    } catch (e) {
      console.error("Invalid token", e);
    }
  }


  const pathname = req.nextUrl.pathname;

  // ------------------------------
  // 1. Protéger /dashboard-vendeur
  // ------------------------------
  if (pathname.startsWith("/dashboard-vendeur")) {
    if (!token) {
      // Pas connecté → redirige vers login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (role == "CLIENT") {
      // Connecté mais mauvais rôle → renvoi accueil
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ---------------------------------------------------
  // 2. Empêcher un utilisateur connecté d'aller sur /auth/login
  // ---------------------------------------------------
  if (pathname.startsWith("/auth/login")) {
    if (token) {
      // Déjà connecté → redirige selon rôle
      if (role !== "CLIENT") {
        return NextResponse.redirect(new URL("/dashboard-vendeur", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Zones de l'app surveillées par le middleware
//  Les routes surveillées par le middleware
export const config = {
  matcher: [
    "/product/new",
    "/dashboard-vendeur",
    "/product",
    "/sales",
    "/profil",
    "/auth/login",
    "/auth/register",
  ],
}

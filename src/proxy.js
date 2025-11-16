import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("token")?.value || null;

  const protectedRoutes = ["/dashboard", "/users"];

  const { pathname } = req.nextUrl;

  // If route is protected & token not found → redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If already logged in and trying to go to login page → redirect to dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*", "/login"],
};

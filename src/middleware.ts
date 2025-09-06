import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define the routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",  // organization
  "/account",    // user
  "/admin",      // admin (if needed)
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // 1) Check if route is protected
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    // Public route - allow
    return NextResponse.next();
  }

  // 2) Get JWT token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Not logged in, redirect to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role;

  // 3) Role-specific access rules
  if (role === "organization") {
    if (pathname.startsWith("/dashboard")) return NextResponse.next();
    url.pathname = "/dashboard"; // redirect org to dashboard
    return NextResponse.redirect(url);
  }

  if (role === "user") {
    if (pathname.startsWith("/account")) return NextResponse.next();
    url.pathname = "/unauthorized"; // block other protected routes
    return NextResponse.redirect(url);
  }

  if (role === "admin") {
    if (pathname.startsWith("/admin")) return NextResponse.next();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // Default deny
  url.pathname = "/unauthorized";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

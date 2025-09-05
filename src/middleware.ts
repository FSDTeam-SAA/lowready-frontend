import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_EXACT = [
  "/",
  "/faqs",
  "/privacy-policy",
  "/about-us",
  "/contact-us",
  "/facilities",
  "/search",
  "/blogs",
  "/login",
  "/signinaspage",
  "/signup",
  "/forget-password",
  "/verify-otp",
  "/forget-otp",
  "/favicon.ico",
];
const PUBLIC_PREFIX = [
  "/_next/",
  "/_next/image",
  "/static/",
  "/api/auth/",
  "/:path*",
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // 1) Allow public routes and static assets
  if (
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PREFIX.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // 2) Get JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("Debug - Current path:", pathname);
    console.log("Debug - Token:", token);
  }
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Your role is directly on the token
  const role = token.role;

  if (!role) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // 3) Special handling for /login
  if (pathname === "/login") {
    if (role === "organization") {
      url.pathname = "/dashboard";
    } else if (role === "user") {
      url.pathname = "/account";
    } else if (role === "admin") {
      url.pathname = "/unauthorized"; // or "/admin/dashboard"
    } else {
      url.pathname = "/unauthorized";
    }
    return NextResponse.redirect(url);
  }

  // 4) Role-specific rules
  console.log("🔍 DEBUG - Processing role-specific rules for role:", role);

  if (role === "organization") {
    console.log("✅ DEBUG - Organization role detected");
    // Organization users can only access:
    // - /dashboard and its subroutes (their main area)
    if (pathname.startsWith("/dashboard")) {
      console.log("✅ DEBUG - Organization accessing dashboard - ALLOWED");
      return NextResponse.next();
    }

    // Redirect to dashboard for all other routes
    console.log(
      "❌ DEBUG - Organization trying to access non-dashboard route - REDIRECTING"
    );
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (role === "user") {
    // Users can access:
    console.log("✅ DEBUG - User accessing general website - ALLOWED");
    // - /account and its subroutes (their main area)
    // - General website pages (but NOT /dashboard)
    if (pathname.startsWith("/account")) {
      return NextResponse.next();
    }

    // Block access to /dashboard for users
    if (pathname.startsWith("/dashboard")) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // Allow access to all other routes (general website)
    return NextResponse.next();
  }

  if (role === "admin") {
    // Adjust if you want an admin dashboard
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // Default deny
  url.pathname = "/unauthorized";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All public asset directories
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|about|gallary|blogs|contact|images|public|icons|assets).*)",
  ],
};

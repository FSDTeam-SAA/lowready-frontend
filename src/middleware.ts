import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // 1️⃣ Define public paths that don't require authentication
  const publicPaths = [
    "/_next/",
    "/favicon.ico",
    "/",
    "/about",
    "/contact",
    "/blog",
    "/services",
  ];

  // Allow public paths without authentication
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2️⃣ Get JWT token from NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Special handling for login route
  if (pathname === "/login") {
    // If already logged in, redirect based on role
    if (token) {
      if (token.role === "admin") {
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }

      url.pathname = token.role === "organization" ? "/dashboard" : "/account";
      return NextResponse.redirect(url);
    }
    // Not logged in, allow access to login page
    return NextResponse.next();
  }

  // 3️⃣ Not logged in → redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 4️⃣ Handle admin role - restrict access completely
  if (token.role === "admin") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Define role-based route access
  const roleRouteAccess: Record<
    string,
    { allowed: string[]; restricted: string[] }
  > = {
    user: {
      allowed: ["/account"],
      restricted: ["/dashboard"],
    },
    organization: {
      allowed: ["/dashboard"],
      restricted: ["/account", "/"],
    },
  };

  const roleAccess =
    roleRouteAccess[token.role as keyof typeof roleRouteAccess];

  // 6️⃣ Check for restricted paths
  if (roleAccess?.restricted.some((route) => pathname.startsWith(route))) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // 7️⃣ Check for allowed paths
  if (roleAccess?.allowed.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 8️⃣ Handle organization access to website routes
  if (token.role === "organization" && !pathname.startsWith("/dashboard")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 9️⃣ Handle user access
  if (token.role === "user") {
    // Allow access to website routes for users
    if (
      !pathname.startsWith("/account") &&
      !pathname.startsWith("/dashboard")
    ) {
      return NextResponse.next();
    }
  }

  // 🔟 Default: redirect to unauthorized
  url.pathname = "/unauthorized";
  return NextResponse.redirect(url);
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

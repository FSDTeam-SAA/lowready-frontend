import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // 1️⃣ Skip middleware for public paths
  const publicPaths = ["/login", "/_next/", "/favicon.ico"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2️⃣ Get JWT token from NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 3️⃣ Not logged in → redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = token.role;

  // 4️⃣ Define role-based route whitelist
  const roleRouteWhitelist: Record<string, string[]> = {
    user: ["/account", "/account/profile", "/account/settings"],
    organization: ["/dashboard", "/dashboard/profile", "/dashboard/settings"],
    // Add more roles here
  };

  const allowedRoutes = roleRouteWhitelist[role] || [];

  // 5️⃣ Redirect if user tries to access forbidden route
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));
  if (!isAllowed) {
    url.pathname = "/"; // or unauthorized page
    return NextResponse.redirect(url);
  }

  // 6️⃣ Redirect logged-in users away from /login
  if (pathname.startsWith("/login")) {
    url.pathname = allowedRoutes[0]; // redirect to default route for role
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 7️⃣ Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/login"],
};

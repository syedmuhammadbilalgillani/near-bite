import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const url = request.nextUrl.clone();

  // Define the protected routes that require authentication (including the homepage)
  const protectedPaths = [
    "/Announcements",
    "/combo-products",
    "/products",
    "/categories",
    "/companies",
    "/", // Protect the homepage (dashboard)
  ];

  const isProtectedRoute = protectedPaths.some((path) =>
    url.pathname.startsWith(path),
  );

  if (!token && isProtectedRoute && !url.pathname.startsWith("/login")) {
    url.pathname = "/login"; // Redirect to login if not authenticated
    return NextResponse.redirect(url);
  }

  // If user is authenticated but tries to access login page, redirect to homepage
  if (token && url.pathname === "/login") {
    url.pathname = "/"; // Redirect to homepage if already authenticated
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply this middleware to the defined routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/Announcements/:path*",
    "/combo-products/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/companies/:path*",
    "/login", // Allow access to the login page
  ],
};

import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";
import { routing } from "./i18n/routing";

const handleIntl = createMiddleware(routing);
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "voustech-admin-super-secret-key-2026"
);
const COOKIE_NAME = "voustech_admin_session";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect all /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    let isValid = false;

    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        isValid = true;
      } catch {
        isValid = false;
      }
    }

    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect all /api/admin endpoints (except auth routes)
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login") &&
    !pathname.startsWith("/api/admin/auth/verify-otp")
  ) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    let isValid = false;

    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        isValid = true;
      } catch {
        isValid = false;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized access. Valid admin login session required." },
        { status: 401 }
      );
    }
  }

  // 3. Handle next-intl routing for public pages
  return handleIntl(request);
}

export const config = {
  matcher: [
    // Match all admin pages, admin API routes, and localized public routes
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|llms.txt|icon.png|apple-icon.png|brand/).*)",
  ],
};

import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";
import { routing } from "./i18n/routing";
import { inspectRequest } from "./lib/waf";
import {
  isIpJailed,
  jailIp,
  checkGlobalRateLimit,
  checkApiRateLimit,
} from "./lib/securityGuard";

const handleIntl = createMiddleware(routing);
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "voustech-admin-super-secret-key-2026"
);
const COOKIE_NAME = "voustech_admin_session";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Immediately pass through static .html files (e.g. Google Search Console verification)
  if (pathname.endsWith(".html") || pathname.includes("google")) {
    return NextResponse.next();
  }

  // ==========================================
  // 🛡️ VOUSTECH SHIELD: DDOS & WAF CYBER DEFENSE
  // ==========================================
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Check IP Blacklist / Jail
  const jailStatus = isIpJailed(ip);
  if (jailStatus.jailed) {
    return new NextResponse(
      JSON.stringify({
        error: "Access Denied by VousTech Shield WAF",
        message: "Your IP address has been temporarily banned due to suspicious activity.",
        reason: jailStatus.reason,
        retryAfter: `${jailStatus.retryAfterSeconds} seconds`,
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-VousTech-Shield": "Blocked-Jail",
          "Retry-After": String(jailStatus.retryAfterSeconds ?? 3600),
        },
      }
    );
  }

  // 2. Real-Time WAF Signature Inspection (SQLi, XSS, RCE, Path Traversal, Scanners)
  const wafCheck = inspectRequest(
    pathname,
    request.nextUrl.searchParams,
    request.headers
  );

  if (wafCheck.blocked) {
    // Automatically jail the attacking IP
    if (wafCheck.severity === "high" || wafCheck.severity === "critical") {
      jailIp(ip, wafCheck.reason ?? "Malicious payload signature detected");
    }

    return new NextResponse(
      JSON.stringify({
        error: "Request Blocked by VousTech Shield WAF",
        threat: wafCheck.threatType,
        message: "Your request triggered an automated security defense signature.",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-VousTech-Shield": "Blocked-WAF",
        },
      }
    );
  }

  // 3. Layer-7 Anti-DDoS Burst Rate Limiting
  const isApi = pathname.startsWith("/api");
  const rateLimitResult = isApi ? checkApiRateLimit(ip) : checkGlobalRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please slow down your requests.",
        retryAfter: `${rateLimitResult.retryAfter} seconds`,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-VousTech-Shield": "Rate-Limited",
          "Retry-After": String(rateLimitResult.retryAfter ?? 60),
        },
      }
    );
  }

  // 1. Protect Admin UI Pages (/admin/...) - Exclude API routes and /admin/login
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

  // 2. Protect Admin API Endpoints (/api/admin/...) - Exclude /api/admin/auth/*
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/")
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

  // Bypass next-intl localization for all /admin and /api requests
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3. Handle root / redirection preserving user preference cookie or defaulting to French
  if (pathname === "/") {
    const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const targetLocale = savedLocale === "en" ? "en" : "fr";
    const url = new URL(`/${targetLocale}`, request.url);
    const res = NextResponse.redirect(url);
    if (!savedLocale) {
      res.cookies.set("NEXT_LOCALE", "fr", { path: "/", maxAge: 31536000, sameSite: "lax" });
    }
    return res;
  }

  // 4. Handle next-intl routing for public pages
  return handleIntl(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|llms.txt|icon.png|apple-icon.png|brand/|google*.html).*)",
  ],
};

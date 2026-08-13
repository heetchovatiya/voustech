import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAdminToken, setAdminSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, otpCode } = body;

    if (!username || !otpCode) {
      return NextResponse.json(
        { ok: false, error: "Username and OTP code are required" },
        { status: 400 }
      );
    }

    const admin = await db.adminUser.findUnique({
      where: { username: String(username).trim() },
    });

    if (!admin || !admin.otpCode || !admin.otpExpiresAt) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired OTP code" },
        { status: 401 }
      );
    }

    // Check OTP expiration
    if (new Date() > new Date(admin.otpExpiresAt)) {
      return NextResponse.json(
        { ok: false, error: "OTP code has expired. Please log in again." },
        { status: 401 }
      );
    }

    // Check OTP code match
    if (admin.otpCode.trim() !== String(otpCode).trim()) {
      return NextResponse.json(
        { ok: false, error: "Invalid 6-digit OTP code" },
        { status: 401 }
      );
    }

    // Clear OTP code once verified
    await db.adminUser.update({
      where: { id: admin.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    // Generate JWT token & set HttpOnly Cookie
    const token = await createAdminToken({ username: admin.username, email: admin.email });
    await setAdminSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin-verify-otp-error]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

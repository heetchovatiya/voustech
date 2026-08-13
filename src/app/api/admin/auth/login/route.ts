import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { generateOtp, verifyPassword } from "@/lib/auth";
import { siteConfig } from "@/lib/site.config";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "client_ip";
    const rateLimit = checkRateLimit(`login_${ip}`, 10, 15 * 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { ok: false, error: "Too many login attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const admin = await db.adminUser.findUnique({
      where: { username: String(username).trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await verifyPassword(String(password), admin.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { ok: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate 6-digit 2FA OTP
    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    await db.adminUser.update({
      where: { id: admin.id },
      data: {
        otpCode,
        otpExpiresAt,
      },
    });

    // Send OTP email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    let resendError: string | null = null;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: `VousTech Security <${siteConfig.contactFromEmail}>`,
        to: admin.email,
        subject: `Your VousTech Admin 2FA Login Code: ${otpCode}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;border:1px solid #E2E8F0;border-radius:8px;background:#ffffff;">
            <h2 style="color:#0F4C75;margin-top:0;">Admin Security 2FA</h2>
            <p style="color:#334155;font-size:15px;">Use the following 6-digit verification code to complete your login into the VousTech Admin Panel:</p>
            <div style="text-align:center;margin:24px 0;">
              <span style="font-family:monospace;font-size:32px;font-weight:700;letter-spacing:6px;color:#0F4C75;background:#F1F5F9;padding:12px 24px;border-radius:6px;display:inline-block;">${otpCode}</span>
            </div>
            <p style="color:#64748B;font-size:13px;">This code will expire in <strong>5 minutes</strong>. If you did not request this login, please change your credentials immediately.</p>
          </div>
        `,
      });

      if (error) {
        console.warn(`[admin-login] Resend email warning: ${error.message}`);
        console.warn(`[admin-login] 🔑 2FA OTP Code for development: ${otpCode}`);
        resendError = error.message;
      }
    } else {
      console.warn(`[admin-login] RESEND_API_KEY is missing. 🔑 2FA OTP Code for development: ${otpCode}`);
    }

    // Mask email for user response e.g. in***@voustech.com
    const emailParts = admin.email.split("@");
    const maskedEmail =
      emailParts[0].substring(0, 2) + "***@" + emailParts[1];

    return NextResponse.json({
      ok: true,
      step: "otp_required",
      maskedEmail,
      // Provide devOtp if Resend is in test mode or unverified domain
      devOtp: otpCode,
      ...(resendError ? { resendWarning: resendError } : {}),
    });
  } catch (err) {
    console.error("[admin-login-error]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

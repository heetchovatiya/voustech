import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { siteConfig } from "@/lib/site.config";
import { db } from "@/lib/db";

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  serviceInterest: z.string().trim().min(1).max(200),
  budgetRange: z.string().trim().max(100).optional().or(z.literal("")),
  projectDetails: z.string().trim().min(1).max(5000),
  locale: z.string().max(5).optional(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY is not set — skipping send. Configure it in .env.local to deliver leads."
    );
    return NextResponse.json(
      { ok: false, error: "missing_api_key", message: "RESEND_API_KEY is not configured in .env.local" },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const fields: [string, string | undefined][] = [
      ["Full name", data.fullName],
      ["Company / organization", data.company],
      ["Email", data.email],
      ["Phone / WhatsApp", data.phone],
      ["Service interested in", data.serviceInterest],
      ["Budget range", data.budgetRange],
    ];

    const rowsHtml = fields
      .filter(([, value]) => value)
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 12px;font-weight:600;">${escapeHtml(label)}</td><td style="padding:4px 12px;">${escapeHtml(String(value))}</td></tr>`
      )
      .join("");

    const html = `
      <div style="font-family:sans-serif;color:#1B262C;">
        <h2 style="color:#0F4C75;">New consultation request</h2>
        <table>${rowsHtml}</table>
        <p style="font-weight:600;margin-top:16px;">Project details</p>
        <p style="white-space:pre-wrap;">${escapeHtml(data.projectDetails)}</p>
      </div>
    `;

    // 1. Always save lead to SQLite Database for Admin Panel management
    let leadCreated = false;
    try {
      await db.lead.create({
        data: {
          fullName: data.fullName,
          company: data.company || null,
          email: data.email,
          phone: data.phone || null,
          serviceInterest: data.serviceInterest,
          budgetRange: data.budgetRange || null,
          projectDetails: data.projectDetails,
          locale: data.locale || "en",
          status: "new",
        },
      });
      leadCreated = true;
    } catch (dbErr) {
      console.error("[contact] Failed to record lead in database:", dbErr);
    }

    // 2. Attempt admin email delivery via Resend
    const { error } = await resend.emails.send({
      from: `VousTech Website <${siteConfig.contactFromEmail}>`,
      to: siteConfig.contactInboxEmail,
      replyTo: data.email,
      subject: `New consultation request from ${data.fullName}`,
      html,
    });

    // 3. Send Personalized Auto-Reply Confirmation Email to Client
    try {
      const autoReplyHtml = `
        <div style="font-family:sans-serif;color:#1B262C;max-width:600px;margin:0 auto;padding:20px;border:1px solid #E2E8F0;border-radius:12px;">
          <h2 style="color:#0F4C75;margin-top:0;">Thank you for contacting VousTech!</h2>
          <p>Hi <strong>${escapeHtml(data.fullName)}</strong>,</p>
          <p>We have successfully received your inquiry regarding <strong>${escapeHtml(data.serviceInterest)}</strong>.</p>
          <p>Our engineering and design team is reviewing your project details. A dedicated technical consultant will get back to you within 1 business day with clear next steps for your project.</p>
          <hr style="border:none;border-top:1px solid #E2E8F0;margin:20px 0;" />
          <p style="font-size:12px;color:#64748B;">
            <strong>VousTech Studio</strong><br />
            Email: <a href="mailto:${siteConfig.contactInboxEmail}" style="color:#0F4C75;">${siteConfig.contactInboxEmail}</a><br />
            Website: <a href="${siteConfig.url}" style="color:#0F4C75;">${siteConfig.url}</a>
          </p>
        </div>
      `;

      await resend.emails.send({
        from: `VousTech <${siteConfig.contactFromEmail}>`,
        to: data.email,
        subject: `We've received your inquiry - VousTech`,
        html: autoReplyHtml,
      });
    } catch (replyErr) {
      console.warn("[contact] Auto-reply email warning:", replyErr);
    }

    if (error) {
      console.warn("[contact] Resend admin email warning:", error.message);
      if (leadCreated) {
        return NextResponse.json({ ok: true, leadSaved: true, emailWarning: error.message });
      }
      return NextResponse.json(
        { ok: false, error: "resend_error", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

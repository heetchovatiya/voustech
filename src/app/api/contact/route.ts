import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { siteConfig } from "@/lib/site.config";

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
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
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

    const { error } = await resend.emails.send({
      from: `VousTech Website <${siteConfig.contactFromEmail}>`,
      to: siteConfig.contactInboxEmail,
      replyTo: data.email,
      subject: `New consultation request from ${data.fullName}`,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { siteConfig } from "@/lib/site.config";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const [campaigns, subscribersCount, leadsCount] = await Promise.all([
    db.campaign.findMany({ orderBy: { sentAt: "desc" } }),
    db.subscriber.count({ where: { status: "active" } }),
    db.lead.count(),
  ]);

  return NextResponse.json({
    ok: true,
    campaigns,
    stats: {
      subscribersCount,
      leadsCount,
      totalAudienceCount: subscribersCount + leadsCount,
    },
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { subject, message, sendToLeads } = body;

    if (!subject || !message) {
      return NextResponse.json({ ok: false, error: "Subject and Message required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    // Gather audience email addresses
    const subscribers = await db.subscriber.findMany({
      where: { status: "active" },
      select: { email: true },
    });

    let leadEmails: string[] = [];
    if (sendToLeads) {
      const leads = await db.lead.findMany({ select: { email: true } });
      leadEmails = leads.map((l) => l.email);
    }

    const allRecipients = Array.from(
      new Set([...subscribers.map((s) => s.email), ...leadEmails])
    ).filter(Boolean);

    if (allRecipients.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "No active subscribers or leads found to send campaign to.",
      }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    let sentCount = 0;

    const emailHtml = `
      <div style="font-family:sans-serif;color:#1B262C;max-width:600px;margin:0 auto;padding:24px;border:1px solid #E2E8F0;border-radius:12px;">
        <h2 style="color:#0F4C75;margin-top:0;">${subject}</h2>
        <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:#334155;">${message}</div>
        <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0 16px 0;" />
        <p style="font-size:12px;color:#64748B;text-align:center;">
          Sent via <strong>VousTech News</strong><br />
          <a href="${siteConfig.url}" style="color:#0F4C75;">${siteConfig.url}</a> | <a href="mailto:${siteConfig.contactInboxEmail}" style="color:#0F4C75;">${siteConfig.contactInboxEmail}</a>
        </p>
      </div>
    `;

    // Send emails in batches via Resend
    for (const recipient of allRecipients) {
      try {
        await resend.emails.send({
          from: `VousTech News <${siteConfig.contactFromEmail}>`,
          to: recipient,
          subject,
          html: emailHtml,
        });
        sentCount++;
      } catch (err) {
        console.warn(`[campaign-send-error] Failed to send to ${recipient}:`, err);
      }
    }

    const campaign = await db.campaign.create({
      data: {
        subject: String(subject).trim(),
        message: String(message).trim(),
        sentCount,
      },
    });

    return NextResponse.json({ ok: true, campaign, sentCount });
  } catch (err) {
    console.error("[campaigns-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to broadcast email campaign" }, { status: 500 });
  }
}

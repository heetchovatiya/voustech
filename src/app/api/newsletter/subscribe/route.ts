import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const subscribeSchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;

    await db.subscriber.upsert({
      where: { email },
      update: { status: "active", name: name || undefined },
      create: { email, name: name || null, status: "active" },
    });

    return NextResponse.json({ ok: true, message: "Successfully subscribed to VousTech News!" });
  } catch (err) {
    console.error("[newsletter-subscribe-error]", err);
    return NextResponse.json(
      { ok: false, error: "Failed to process subscription. Please try again later." },
      { status: 500 }
    );
  }
}

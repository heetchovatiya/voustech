import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, testimonials });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientName, clientRole, company, avatarUrl, content, rating } = body;

    if (!clientName || !clientRole || !company || !content) {
      return NextResponse.json({ ok: false, error: "Required fields missing" }, { status: 400 });
    }

    const testimonial = await db.testimonial.create({
      data: {
        clientName: String(clientName).trim(),
        clientRole: String(clientRole).trim(),
        company: String(company).trim(),
        avatarUrl: avatarUrl ? String(avatarUrl).trim() : null,
        content: String(content).trim(),
        rating: Number(rating) || 5,
      },
    });

    return NextResponse.json({ ok: true, testimonial });
  } catch (err) {
    console.error("[testimonials-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, clientName, clientRole, company, avatarUrl, content, rating } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        clientName: clientName ? String(clientName).trim() : undefined,
        clientRole: clientRole ? String(clientRole).trim() : undefined,
        company: company ? String(company).trim() : undefined,
        avatarUrl: avatarUrl !== undefined ? (avatarUrl ? String(avatarUrl).trim() : null) : undefined,
        content: content ? String(content).trim() : undefined,
        rating: rating !== undefined ? Number(rating) : undefined,
      },
    });

    return NextResponse.json({ ok: true, testimonial });
  } catch (err) {
    console.error("[testimonials-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID parameter required" }, { status: 400 });
    }

    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[testimonials-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete testimonial" }, { status: 500 });
  }
}

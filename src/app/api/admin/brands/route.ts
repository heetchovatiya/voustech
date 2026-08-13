import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const logos = await db.clientLogo.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ ok: true, logos });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, logoUrl, websiteUrl, displayOrder } = body;

    if (!name || !logoUrl) {
      return NextResponse.json({ ok: false, error: "Name and Logo URL required" }, { status: 400 });
    }

    const logo = await db.clientLogo.create({
      data: {
        name: String(name).trim(),
        logoUrl: String(logoUrl).trim(),
        websiteUrl: websiteUrl ? String(websiteUrl).trim() : null,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    return NextResponse.json({ ok: true, logo });
  } catch (err) {
    console.error("[brands-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create partner logo" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, logoUrl, websiteUrl, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
    }

    const logo = await db.clientLogo.update({
      where: { id },
      data: {
        name: name ? String(name).trim() : undefined,
        logoUrl: logoUrl ? String(logoUrl).trim() : undefined,
        websiteUrl: websiteUrl !== undefined ? (websiteUrl ? String(websiteUrl).trim() : null) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    return NextResponse.json({ ok: true, logo });
  } catch (err) {
    console.error("[brands-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update partner logo" }, { status: 500 });
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

    await db.clientLogo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[brands-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete partner logo" }, { status: 500 });
  }
}

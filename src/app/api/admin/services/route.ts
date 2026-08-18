import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const services = await db.service.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ ok: true, services });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, category, summary, description, deliverables, iconName } = body;

    if (!title || !category || !summary || !description) {
      return NextResponse.json({ ok: false, error: "Required fields missing" }, { status: 400 });
    }

    const generatedSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const deliverablesString = Array.isArray(deliverables) ? JSON.stringify(deliverables) : typeof deliverables === "string" ? deliverables : "[]";

    const service = await db.service.create({
      data: {
        title: String(title).trim(),
        slug: generatedSlug,
        category: String(category).trim(),
        summary: String(summary).trim(),
        description: String(description).trim(),
        deliverables: deliverablesString,
        iconName: iconName ? String(iconName).trim() : null,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, service });
  } catch (err) {
    console.error("[services-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, category, summary, description, deliverables, iconName } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Service ID required" }, { status: 400 });
    }

    const deliverablesString = Array.isArray(deliverables) ? JSON.stringify(deliverables) : typeof deliverables === "string" ? deliverables : "[]";

    const service = await db.service.update({
      where: { id },
      data: {
        title: title ? String(title).trim() : undefined,
        slug: slug ? String(slug).trim() : undefined,
        category: category ? String(category).trim() : undefined,
        summary: summary ? String(summary).trim() : undefined,
        description: description ? String(description).trim() : undefined,
        deliverables: deliverablesString,
        iconName: iconName !== undefined ? (iconName ? String(iconName).trim() : null) : undefined,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, service });
  } catch (err) {
    console.error("[services-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update service" }, { status: 500 });
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

    await db.service.delete({ where: { id } });
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[services-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete service" }, { status: 500 });
  }
}

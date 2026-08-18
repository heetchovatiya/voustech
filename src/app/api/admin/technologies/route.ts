import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const technologies = await db.technology.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ ok: true, technologies });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, category, iconName, description, displayOrder, featured } = body;

    if (!name || !category || !description) {
      return NextResponse.json({ ok: false, error: "Required fields missing" }, { status: 400 });
    }

    const generatedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const technology = await db.technology.create({
      data: {
        name: String(name).trim(),
        slug: generatedSlug,
        category: String(category).trim(),
        iconName: iconName ? String(iconName).trim() : null,
        description: String(description).trim(),
        displayOrder: Number(displayOrder) || 0,
        featured: Boolean(featured ?? true),
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, technology });
  } catch (err) {
    console.error("[technologies-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create technology" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, slug, category, iconName, description, displayOrder, featured } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Technology ID required" }, { status: 400 });
    }

    const technology = await db.technology.update({
      where: { id },
      data: {
        name: name ? String(name).trim() : undefined,
        slug: slug ? String(slug).trim() : undefined,
        category: category ? String(category).trim() : undefined,
        iconName: iconName !== undefined ? (iconName ? String(iconName).trim() : null) : undefined,
        description: description ? String(description).trim() : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
        featured: featured !== undefined ? Boolean(featured) : undefined,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, technology });
  } catch (err) {
    console.error("[technologies-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update technology" }, { status: 500 });
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

    await db.technology.delete({ where: { id } });
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[technologies-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete technology" }, { status: 500 });
  }
}

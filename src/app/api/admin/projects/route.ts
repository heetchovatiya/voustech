import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projects = await db.project.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, projects });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, category, summary, description, imageUrl, projectUrl, displayOrder, featured, tags } = body;

    if (!title || !category || !summary || !description) {
      return NextResponse.json({ ok: false, error: "Required fields missing" }, { status: 400 });
    }

    const generatedSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : typeof tags === "string" ? tags : "[]";

    const project = await db.project.create({
      data: {
        title: String(title).trim(),
        slug: generatedSlug,
        category: String(category).trim(),
        summary: String(summary).trim(),
        description: String(description).trim(),
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
        projectUrl: projectUrl ? String(projectUrl).trim() : null,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        featured: Boolean(featured),
        tags: tagsString,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error("[projects-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, category, summary, description, imageUrl, projectUrl, displayOrder, featured, tags } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Project ID required" }, { status: 400 });
    }

    const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : typeof tags === "string" ? tags : "[]";

    const project = await db.project.update({
      where: { id },
      data: {
        title: title ? String(title).trim() : undefined,
        slug: slug ? String(slug).trim() : undefined,
        category: category ? String(category).trim() : undefined,
        summary: summary ? String(summary).trim() : undefined,
        description: description ? String(description).trim() : undefined,
        imageUrl: imageUrl !== undefined ? (imageUrl ? String(imageUrl).trim() : null) : undefined,
        projectUrl: projectUrl !== undefined ? (projectUrl ? String(projectUrl).trim() : null) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        tags: tagsString,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error("[projects-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update project" }, { status: 500 });
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

    await db.project.delete({ where: { id } });
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[projects-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete project" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const blogs = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, blogs });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, author, published } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json({ ok: false, error: "Required fields missing" }, { status: 400 });
    }

    const generatedSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const blog = await db.blogPost.create({
      data: {
        title: String(title).trim(),
        slug: generatedSlug,
        excerpt: String(excerpt).trim(),
        content: String(content).trim(),
        coverImage: coverImage ? String(coverImage).trim() : null,
        author: author ? String(author).trim() : "VousTech Team",
        published: Boolean(published),
      },
    });

    return NextResponse.json({ ok: true, blog });
  } catch (err) {
    console.error("[blogs-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, excerpt, content, coverImage, author, published } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
    }

    const blog = await db.blogPost.update({
      where: { id },
      data: {
        title: title ? String(title).trim() : undefined,
        slug: slug ? String(slug).trim() : undefined,
        excerpt: excerpt ? String(excerpt).trim() : undefined,
        content: content ? String(content).trim() : undefined,
        coverImage: coverImage !== undefined ? (coverImage ? String(coverImage).trim() : null) : undefined,
        author: author ? String(author).trim() : undefined,
        published: published !== undefined ? Boolean(published) : undefined,
      },
    });

    return NextResponse.json({ ok: true, blog });
  } catch (err) {
    console.error("[blogs-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update blog post" }, { status: 500 });
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

    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[blogs-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete blog post" }, { status: 500 });
  }
}

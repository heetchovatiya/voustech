import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const faqs = await db.faq.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ ok: true, faqs });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question, answer, category, displayOrder, hidden } = body;

    if (!question || !answer) {
      return NextResponse.json({ ok: false, error: "Question and Answer required" }, { status: 400 });
    }

    const faq = await db.faq.create({
      data: {
        question: String(question).trim(),
        answer: String(answer).trim(),
        category: category ? String(category).trim() : "general",
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        hidden: Boolean(hidden),
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, faq });
  } catch (err) {
    console.error("[faqs-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create FAQ" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, question, answer, category, displayOrder, hidden } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
    }

    const faq = await db.faq.update({
      where: { id },
      data: {
        question: question ? String(question).trim() : undefined,
        answer: answer ? String(answer).trim() : undefined,
        category: category !== undefined ? (category ? String(category).trim() : null) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
        hidden: hidden !== undefined ? Boolean(hidden) : undefined,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, faq });
  } catch (err) {
    console.error("[faqs-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update FAQ" }, { status: 500 });
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

    await db.faq.delete({ where: { id } });
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[faqs-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete FAQ" }, { status: 500 });
  }
}

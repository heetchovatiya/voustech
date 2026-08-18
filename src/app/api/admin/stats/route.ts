import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const metrics = await db.companyMetric.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ ok: true, metrics });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { label, value, suffix, displayOrder } = body;

    if (!label || value === undefined) {
      return NextResponse.json({ ok: false, error: "Label and Value required" }, { status: 400 });
    }

    const metric = await db.companyMetric.create({
      data: {
        label: String(label).trim(),
        value: String(value).trim(),
        suffix: suffix ? String(suffix).trim() : null,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, metric });
  } catch (err) {
    console.error("[stats-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create stat metric" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, label, value, suffix, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });
    }

    const metric = await db.companyMetric.update({
      where: { id },
      data: {
        label: label ? String(label).trim() : undefined,
        value: value !== undefined ? String(value).trim() : undefined,
        suffix: suffix !== undefined ? (suffix ? String(suffix).trim() : null) : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      },
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, metric });
  } catch (err) {
    console.error("[stats-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update stat metric" }, { status: 500 });
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

    await db.companyMetric.delete({ where: { id } });
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[stats-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete stat metric" }, { status: 500 });
  }
}

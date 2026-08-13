import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, leads });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false, error: "ID and status required" }, { status: 400 });
    }

    const lead = await db.lead.update({
      where: { id },
      data: { status: String(status).trim() },
    });

    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    console.error("[leads-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update lead" }, { status: 500 });
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

    await db.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[leads-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete lead" }, { status: 500 });
  }
}

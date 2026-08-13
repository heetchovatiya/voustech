import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, hashPassword } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.adminUser.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ ok: true, users });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ ok: false, error: "Username, email, and password required" }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const existing = await db.adminUser.findUnique({
      where: { username: String(username).trim() },
    });

    if (existing) {
      return NextResponse.json({ ok: false, error: "Username already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(String(password));

    const user = await db.adminUser.create({
      data: {
        username: String(username).trim(),
        email: String(email).trim().toLowerCase(),
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("[users-create-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to create admin user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, email, newPassword } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: "User ID required" }, { status: 400 });
    }

    const updateData: { email?: string; passwordHash?: string } = {};

    if (email) {
      updateData.email = String(email).trim().toLowerCase();
    }

    if (newPassword) {
      if (String(newPassword).length < 8) {
        return NextResponse.json({ ok: false, error: "New password must be at least 8 characters long" }, { status: 400 });
      }
      updateData.passwordHash = await hashPassword(String(newPassword));
    }

    const user = await db.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("[users-update-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to update user" }, { status: 500 });
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
      return NextResponse.json({ ok: false, error: "User ID required" }, { status: 400 });
    }

    const targetUser = await db.adminUser.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Security Guard: Prevent deleting your own active account!
    if (targetUser.username === session.username) {
      return NextResponse.json({ ok: false, error: "You cannot delete your own active admin account." }, { status: 400 });
    }

    await db.adminUser.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[users-delete-error]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete user" }, { status: 500 });
  }
}

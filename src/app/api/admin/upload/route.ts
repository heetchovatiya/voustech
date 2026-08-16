import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

function cleanFileName(originalName: string, customName?: string | null): string {
  const parts = originalName.split(".");
  const rawExt = parts.length > 1 ? parts.pop()!.toLowerCase() : "webp";
  const ext = rawExt === "svg" ? "svg" : "webp";
  const rawBase = (customName && customName.trim()) ? customName.trim() : parts.join(".");

  // Normalize: lowercase, replace spaces/special characters with hyphens
  let cleaned = rawBase
    .toLowerCase()
    .replace(/^screenshot[-_\s\d]*/g, "")
    .replace(/^img[-_\s\d]*/g, "")
    .replace(/^whatsapp[-_\s\d]*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Fallback if generic or empty
  if (!cleaned || cleaned.length < 2 || /^(image|img|screenshot|untitled|photo|file|upload|asset)$/.test(cleaned)) {
    cleaned = "project";
  }

  // Exact format: voustech-project1.webp
  return `voustech-${cleaned}.${ext}`;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customName = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    const filename = cleanFileName(file.name, customName);
    const contentType = filename.endsWith(".svg") ? "image/svg+xml" : "image/webp";

    // 1. If Vercel Blob token exists, use Vercel Blob CDN
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: "public",
        contentType,
      });

      return NextResponse.json({
        ok: true,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
      });
    }

    // 2. Serverless & Local Fallback: Convert to Base64 Data URL (No disk writes required)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = contentType;
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      ok: true,
      url: dataUrl,
      downloadUrl: dataUrl,
      pathname: filename,
    });
  } catch (err) {
    console.error("[upload-error]", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}

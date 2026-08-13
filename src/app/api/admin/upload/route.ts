import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // 1. If Vercel Blob token exists, use Vercel Blob CDN
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: "public",
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
    const mimeType = file.type || "image/png";
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

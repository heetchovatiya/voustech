import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: googlebfd0cc8144330863.html", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

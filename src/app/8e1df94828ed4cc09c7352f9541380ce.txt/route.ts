import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("8e1df94828ed4cc09c7352f9541380ce", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}

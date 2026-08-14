import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let faqs: { question: string; answer: string }[] = [];
  try {
    faqs = await db.faq.findMany({
      where: { hidden: false },
      orderBy: { displayOrder: "asc" },
    });
  } catch (err) {
    console.error("[ai-faq-error]", err);
  }

  return NextResponse.json({ faqs }, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site.config";

export async function GET() {
  const data = {
    name: siteConfig.name,
    url: siteConfig.url,
    description:
      "VousTech is a full-service web development, mobile app, and software engineering company serving clients across Africa and globally.",
    services: [
      "Custom Web Development",
      "Mobile App Development (iOS & Android)",
      "Enterprise Software & ERP Systems",
      "Cloud Infrastructure & Cybersecurity",
      "AI & Business Automation Solutions",
    ],
    contactEmail: siteConfig.contactInboxEmail,
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

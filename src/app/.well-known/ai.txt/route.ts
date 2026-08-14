import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site.config";

export async function GET() {
  const content = `# AI Discovery File for ${siteConfig.name}
User-Agent: *
Allow: /
Sitemap: ${siteConfig.url}/sitemap.xml
Summary: ${siteConfig.url}/ai/summary.json
FAQ: ${siteConfig.url}/ai/faq.json
Contact: ${siteConfig.contactInboxEmail}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

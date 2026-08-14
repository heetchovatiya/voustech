import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site.config";

export async function GET() {
  let blogs: { slug: string; title: string; excerpt: string; publishedAt: Date }[] = [];
  try {
    blogs = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
  } catch (err) {
    console.error("[rss-fetch-error]", err);
  }

  const itemsXml = blogs
    .map(
      (b) => `
    <item>
      <title><![CDATA[${b.title}]]></title>
      <link>${siteConfig.url}/en/blog/${b.slug}</link>
      <guid>${siteConfig.url}/en/blog/${b.slug}</guid>
      <pubDate>${new Date(b.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${b.excerpt}]]></description>
    </item>`
    )
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} — Website &amp; Software Development</title>
    <link>${siteConfig.url}</link>
    <description>Latest insights and news from ${siteConfig.name}</description>
    <language>en-us</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

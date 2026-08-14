import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { services } from "@/content/services";
import enMessages from "@/messages/en.json";
import { siteConfig } from "@/lib/site.config";

const staticPaths = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/contact",
  "/careers",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
];

const blogSlugs = enMessages.blog.posts.map((p) => p.slug);

export async function GET() {
  const paths = [
    ...staticPaths,
    ...services.map((s) => `/services/${s.slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
  ];

  const now = new Date().toISOString();

  const urlBlocks = paths
    .flatMap((path) =>
      routing.locales.map((locale) => {
        const fullUrl = `${siteConfig.url}/${locale}${path === "/" ? "" : path}`;
        const priority = path === "/" ? "1.0" : "0.8";
        const changefreq = path === "/" ? "weekly" : "monthly";

        return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
    )
    .join("\n");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks}
</urlset>`;

  return new NextResponse(xmlContent, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

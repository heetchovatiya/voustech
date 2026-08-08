import type { MetadataRoute } from "next";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...services.map((s) => `/services/${s.slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteConfig.url}/${locale}${path === "/" ? "" : path}`,
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.6,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${siteConfig.url}/${l}${path === "/" ? "" : path}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}

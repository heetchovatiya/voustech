import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PortfolioPreviewClient } from "./PortfolioPreviewClient";

import { db } from "@/lib/db";

export async function PortfolioPreview() {
  const t = await getTranslations("portfolio");

  let dbProjects: { title: string; category: string; summary: string; imageUrl?: string | null; projectUrl?: string | null }[] = [];
  try {
    const projects = await db.project.findMany({
      where: { featured: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      take: 4,
    });
    if (projects.length > 0) {
      dbProjects = projects.map((p) => ({
        title: p.title,
        category: p.category,
        summary: p.summary,
        imageUrl: p.imageUrl,
        projectUrl: p.projectUrl,
      }));
    }
  } catch (err) {
    console.error("[portfolio-preview-db-error]", err);
  }

  // Fallback to original localized portfolio items if DB is empty
  const rawFallback = t.raw("items") as { title: string; category: string; summary: string }[];
  const fallbackProjects = Array.isArray(rawFallback)
    ? rawFallback.slice(0, 4).map((item) => ({
        title: item.title,
        categoryLabel: t.has(`filters.${item.category}`) ? t(`filters.${item.category}`) : item.category,
        summary: item.summary,
        imageUrl: null,
        projectUrl: null,
      }))
    : [];

  const previewItems = dbProjects.length > 0
    ? dbProjects.slice(0, 4).map((item) => {
        const key = `filters.${item.category}`;
        const categoryLabel = t.has(key) ? t(key) : item.category;
        return {
          title: item.title,
          categoryLabel,
          summary: item.summary,
          imageUrl: item.imageUrl,
          projectUrl: item.projectUrl,
        };
      })
    : fallbackProjects;

  return (
    <section aria-labelledby="portfolio-heading" className="border-b border-line bg-base py-16 lg:py-24">
      <Container>
        <SectionHeading
          label={t("label")}
          heading={t("heading")}
          headingId="portfolio-heading"
          body={t("body")}
        />

        <PortfolioPreviewClient items={previewItems} />

        <div className="mt-8">
          <Button href="/portfolio" variant="secondary" showArrow>
            {t("viewFull")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PortfolioPreviewClient } from "./PortfolioPreviewClient";

import { db } from "@/lib/db";

export async function PortfolioPreview() {
  const t = await getTranslations("portfolio");
  const fallbackItems = t.raw("items") as { title: string; category: string; summary: string; imageUrl?: string | null; projectUrl?: string | null }[];

  let dbProjects: { title: string; category: string; summary: string; imageUrl?: string | null; projectUrl?: string | null }[] = [];
  try {
    const projects = await db.project.findMany({
      where: { featured: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
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

  const items = dbProjects.length > 0 ? dbProjects : fallbackItems;

  const previewItems = items.slice(0, 3).map((item) => {
    const key = `filters.${item.category}`;
    const categoryLabel = t.has(key) ? t(key) : item.category;
    return {
      title: item.title,
      categoryLabel,
      summary: item.summary,
      imageUrl: item.imageUrl,
      projectUrl: item.projectUrl,
    };
  });

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

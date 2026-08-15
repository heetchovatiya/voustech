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

  const hasRealProjects = dbProjects.length > 0;

  const previewItems = dbProjects.slice(0, 3).map((item) => {
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

        {hasRealProjects ? (
          <>
            <PortfolioPreviewClient items={previewItems} />
            <div className="mt-8">
              <Button href="/portfolio" variant="secondary" showArrow>
                {t("viewFull")}
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-sm border border-tech-blue/30 bg-surface p-8 sm:p-10 shadow-sm">
            <div className="mx-auto max-w-2xl text-center space-y-4">
              <span className="inline-block rounded-full bg-tech-blue/10 px-3 py-1 font-mono text-xs font-semibold text-tech-blue uppercase tracking-wider">
                Case Study Pipeline 2026 💼
              </span>
              <h3 className="text-heading-sm font-display font-semibold text-ink">
                Be Our Next Highlighted Case Study
              </h3>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                We are actively building custom platforms for forward-thinking organizations across Africa and worldwide. Request a proposal to discuss your custom project.
              </p>
              <div className="pt-2">
                <Button href="/contact" variant="primary" showArrow>
                  Start Your Project
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

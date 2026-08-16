import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { PageIntro } from "@/components/ui/PageIntro";
import { Container } from "@/components/ui/Container";
import { PortfolioFilterGrid } from "@/components/sections/PortfolioFilterGrid";
import { ContactSection } from "@/components/sections/ContactSection";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.portfolio" });
  return buildMetadata({
    locale,
    path: "/portfolio",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");
  const tNav = await getTranslations("nav");

  const fallbackItems = t.raw("items") as { title: string; category: string; summary: string; imageUrl?: string | null; projectUrl?: string | null }[];
  
  let dbProjects: { title: string; category: string; summary: string; imageUrl?: string | null; projectUrl?: string | null }[] = [];
  try {
    const projects = await db.project.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
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
    console.error("[portfolio-db-error]", err);
  }

  const items = dbProjects.length > 0 ? dbProjects : fallbackItems;
  const filterKeys = ["all", "websites", "webApps", "mobileApps", "ecommerce", "branding", "enterprise"];
  const filters = filterKeys.map((id) => ({ id, label: t(`filters.${id}`) }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          { name: tNav("portfolio"), url: `${siteConfig.url}/${locale}/portfolio` },
        ])}
      />
      <PageIntro label={t("label")} heading={t("heading")} body={t("body")} />

      <section className="border-b border-line bg-base py-16 lg:py-24">
        <Container>
          {items.length > 0 ? (
            <PortfolioFilterGrid
              items={items}
              filters={filters}
              filtersLabel={t("filtersLabel")}
              noResultsLabel={t("noResults")}
              placeholderNote=""
            />
          ) : (
            <div className="rounded-sm border border-tech-blue/30 bg-surface p-8 sm:p-12 shadow-sm text-center">
              <div className="mx-auto max-w-2xl space-y-4">
                <span className="inline-block rounded-full bg-tech-blue/10 px-3.5 py-1 font-mono text-xs font-semibold text-tech-blue uppercase tracking-wider">
                  2026 Founding Partner Program 🚀
                </span>
                <h2 className="text-heading-md font-display font-semibold text-ink">
                  Be Our First Highlighted Case Study
                </h2>
                <p className="text-body-sm text-ink-muted leading-relaxed">
                  VousTech is currently onboarding our founding cohort of business and institutional partners in DRC, Central Africa, and globally. Collaborate directly with senior engineers under dedicated SLAs, 100% code ownership, and special launch pricing.
                </p>
                <div className="pt-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-tech-blue px-6 py-3 text-body-sm font-semibold text-white transition-colors hover:bg-deep-ocean"
                  >
                    <span>Request a Founding Proposal &rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      <ContactSection />
    </>
  );
}

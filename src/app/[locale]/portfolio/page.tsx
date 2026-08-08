import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { PageIntro } from "@/components/ui/PageIntro";
import { Container } from "@/components/ui/Container";
import { PortfolioFilterGrid } from "@/components/sections/PortfolioFilterGrid";
import { ContactSection } from "@/components/sections/ContactSection";

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

  const items = t.raw("items") as { title: string; category: string; summary: string }[];
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
          <PortfolioFilterGrid
            items={items}
            filters={filters}
            filtersLabel={t("filtersLabel")}
            noResultsLabel={t("noResults")}
            placeholderNote={t("placeholderNote")}
          />
        </Container>
      </section>

      <ContactSection />
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { PageIntro } from "@/components/ui/PageIntro";
import { Container } from "@/components/ui/Container";
import { StickyIndexDetail, type StickyItem } from "@/components/ui/StickyIndexDetail";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icon";
import { ContactSection } from "@/components/sections/ContactSection";
import { services, serviceCategories } from "@/content/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.services" });
  return buildMetadata({
    locale,
    path: "/services",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tPage = await getTranslations("servicesPage");
  const tNav = await getTranslations("nav");

  const categoryLabels = t.raw("categories") as Record<string, string>;

  const stickyItems: StickyItem[] = services.map((service) => {
    const category = serviceCategories.find((c) => c.id === service.category);
    const categoryLabel = category ? categoryLabels[category.labelKey] : undefined;
    return {
      id: service.slug,
      label: t(`items.${service.slug}.title`),
      detail: (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-sm bg-tech-blue/10 text-tech-blue">
              <Icon name={service.icon} size={22} />
            </span>
            {categoryLabel && (
              <p className="font-mono text-label uppercase tracking-[0.12em] text-ink-muted">
                {categoryLabel}
              </p>
            )}
          </div>

          <h2 className="mt-5 text-heading-sm font-display font-semibold tracking-tight">
            {t(`items.${service.slug}.title`)}
          </h2>
          <p className="mt-3 text-body-lg font-medium text-ink">
            {t(`items.${service.slug}.hook`)}
          </p>
          <p className="mt-3 max-w-xl text-body-sm leading-relaxed text-ink-muted">
            {t(`items.${service.slug}.body`)}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/contact" variant="secondary" showArrow>
              {t(`items.${service.slug}.cta`)}
            </Button>
            <Button href={`/services/${service.slug}`} variant="ghost" showArrow>
              {tPage("viewDetails")}
            </Button>
          </div>
        </div>
      ),
    };
  });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          { name: tNav("services"), url: `${siteConfig.url}/${locale}/services` },
        ])}
      />
      <PageIntro label={t("label")} heading={tPage("heading")} body={tPage("intro")} />

      <section className="border-b border-line bg-base py-12 lg:py-16">
        <Container>
          <StickyIndexDetail items={stickyItems} ariaLabel={tPage("indexLabel")} />
        </Container>
      </section>

      <ContactSection />
    </>
  );
}

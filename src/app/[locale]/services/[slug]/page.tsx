import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ContactSection } from "@/components/sections/ContactSection";
import { services, getServiceBySlug, getServiceCategory } from "@/content/services";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: "services.items" });
  const title = t(`${slug}.title`);
  const hook = t(`${slug}.hook`);

  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: `${title} | VousTech`,
    description: hook,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("services.items");
  const tNav = await getTranslations("nav");
  const tServices = await getTranslations("services");
  const tServicePage = await getTranslations("servicePage");

  const title = t(`${slug}.title`);
  const hook = t(`${slug}.hook`);
  const body = t(`${slug}.body`);
  const cta = t(`${slug}.cta`);
  const category = getServiceCategory(service.category);
  const categoryLabels = tServices.raw("categories") as Record<string, string>;
  const categoryLabel = category ? categoryLabels[category.labelKey] : undefined;

  const related = services
    .filter((s) => s.category === service.category && s.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          { name: tNav("services"), url: `${siteConfig.url}/${locale}/services` },
          { name: title, url: `${siteConfig.url}/${locale}/services/${slug}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: title,
          description: hook,
          url: `${siteConfig.url}/${locale}/services/${slug}`,
        })}
      />

      <PageIntro
        label={
          categoryLabel
            ? `${tServicePage("breadcrumbServices")} · ${categoryLabel}`
            : tServicePage("breadcrumbServices")
        }
        heading={title}
        body={hook}
      >
        <Button href="/contact" variant="secondary" showArrow>
          {cta}
        </Button>
        <Button href="/services" variant="ghost" showArrow>
          {tServices("viewAll")}
        </Button>
      </PageIntro>

      <section className="border-b border-line bg-base py-14 lg:py-20">
        <Container className="max-w-3xl">
          <p className="text-body-lg leading-relaxed text-ink">{body}</p>
          <div className="mt-10 border-t border-line pt-8">
            <h2 className="text-heading-sm font-semibold">
              {tServicePage("ctaHeading", { service: title })}
            </h2>
            <p className="mt-3 text-body text-ink-muted">{tServicePage("ctaBody")}</p>
            <div className="mt-6">
              <Button href="/contact" variant="secondary" showArrow>
                {cta}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-b border-line bg-surface py-14 lg:py-20">
          <Container>
            <h2 className="text-heading-sm font-semibold">{tServicePage("relatedHeading")}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <ServiceCard
                  key={r.slug}
                  slug={r.slug}
                  icon={r.icon}
                  title={t(`${r.slug}.title`)}
                  hook={t(`${r.slug}.hook`)}
                  body={t(`${r.slug}.body`)}
                  cta={t(`${r.slug}.cta`)}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      <ContactSection />
    </>
  );
}

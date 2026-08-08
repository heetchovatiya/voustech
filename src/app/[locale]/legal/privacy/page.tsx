import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { Container } from "@/components/ui/Container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.privacy" });
  return buildMetadata({
    locale,
    path: "/legal/privacy",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.privacy");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const sections = t.raw("sections") as { title: string; body: string }[];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          {
            name: tFooter("legalLinks.privacy"),
            url: `${siteConfig.url}/${locale}/legal/privacy`,
          },
        ])}
      />
      <section className="bg-base py-16 lg:py-24">
        <Container className="max-w-2xl">
          <h1 className="text-heading-lg font-semibold">{t("heading")}</h1>
          <p className="mt-3 font-mono text-label text-ink-muted">
            {t("updated", { date: "2026-01-01" })}
          </p>
          <div className="mt-10 flex flex-col gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-body-lg font-display font-semibold">{section.title}</h2>
                <p className="mt-2 text-body-sm text-ink-muted">{section.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

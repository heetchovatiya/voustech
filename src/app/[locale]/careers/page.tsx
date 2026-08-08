import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.careers" });
  return buildMetadata({
    locale,
    path: "/careers",
    title: t("title"),
    description: t("description"),
  });
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          { name: tFooter("resourcesLinks.careers"), url: `${siteConfig.url}/${locale}/careers` },
        ])}
      />
      <section className="border-b border-line bg-surface py-20 lg:py-28">
        <Container className="max-w-2xl text-center">
          <h1 className="text-heading-lg font-semibold sm:text-display">{t("heading")}</h1>
          <p className="mt-5 text-body-lg text-ink-muted">{t("body")}</p>
          <div className="mt-8 flex justify-center">
            <Button href="/contact" showArrow>
              {t("cta")}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

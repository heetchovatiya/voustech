import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { PageIntro } from "@/components/ui/PageIntro";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Process } from "@/components/sections/Process";
import { ContactSection } from "@/components/sections/ContactSection";

const pillars: { key: "mission" | "vision" | "whyExist"; icon: IconName }[] = [
  { key: "mission", icon: "compass" },
  { key: "vision", icon: "globe" },
  { key: "whyExist", icon: "zap" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return buildMetadata({ locale, path: "/about", title: t("title"), description: t("description") });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          { name: tNav("about"), url: `${siteConfig.url}/${locale}/about` },
        ])}
      />
      <PageIntro label={t("label")} heading={t("heading")} body={t("body")} />

      <section className="border-b border-line bg-base py-12 lg:py-16">
        <Container>
          <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
            {t("pillarsLabel")}
          </p>
          <ul className="mt-6 border-t border-line">
            {pillars.map((pillar, i) => (
              <li key={pillar.key} className="border-b border-line">
                <Reveal delayMs={i * 70}>
                  <article className="group grid grid-cols-[auto_1fr] gap-4 py-6 sm:gap-5 sm:py-8">
                    <span className="mt-0.5 text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
                      <Icon name={pillar.icon} size={22} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-body-lg font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                        {t(`${pillar.key}.title`)}
                      </h2>
                      <p className="mt-2 max-w-2xl text-body-sm leading-relaxed text-ink-muted">
                        {t(`${pillar.key}.body`)}
                      </p>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <WhyChoose />
      <Process />
      <ContactSection />
    </>
  );
}

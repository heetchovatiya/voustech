import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { TrustedByMarquee } from "@/components/sections/TrustedByMarquee";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Technologies } from "@/components/sections/Technologies";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return buildMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustedByMarquee />
      <AboutPreview />
      <ServicesGrid />
      <Process />
      <Technologies />
      <Industries />
      <WhyChoose />
      <PortfolioPreview />
      <Testimonials />
      <StatsCounter />
      <FaqSection />
      <ContactSection />
    </>
  );
}

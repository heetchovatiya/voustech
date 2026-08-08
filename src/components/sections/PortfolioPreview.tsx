import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PortfolioCard } from "@/components/ui/PortfolioCard";

export async function PortfolioPreview() {
  const t = await getTranslations("portfolio");
  const items = t.raw("items") as { title: string; category: string; summary: string }[];

  return (
    <section aria-labelledby="portfolio-heading" className="border-b border-line bg-base py-16 lg:py-24">
      <Container>
        <SectionHeading
          label={t("label")}
          heading={t("heading")}
          headingId="portfolio-heading"
          body={t("body")}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <PortfolioCard
              key={item.title}
              title={item.title}
              categoryLabel={t(`filters.${item.category}`)}
              summary={item.summary}
            />
          ))}
        </div>

        <div className="mt-8">
          <Button href="/portfolio" variant="secondary" showArrow>
            {t("viewFull")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

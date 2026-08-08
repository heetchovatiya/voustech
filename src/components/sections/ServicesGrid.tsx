import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ServicesDomainPanel } from "./ServicesDomainPanel";

export async function ServicesGrid() {
  const t = await getTranslations("services");

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-b border-line bg-surface py-16 lg:py-24"
    >
      <Container>
        <SectionHeading
          label={t("label")}
          heading={t("heading")}
          headingId="services-heading"
          body={t("intro")}
        />

        <ServicesDomainPanel />

        <div className="mt-8">
          <Button href="/services" variant="secondary" showArrow>
            {t("viewAll")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

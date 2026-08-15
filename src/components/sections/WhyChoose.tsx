import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { WhyChooseClient } from "./WhyChooseClient";

export async function WhyChoose() {
  const t = await getTranslations("whyChoose");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="border-b border-line bg-base py-12 lg:py-16"
    >
      <Container>
        <div className="grid items-end gap-3 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("label")}
            </p>
            <h2
              id="why-choose-heading"
              className="mt-2 max-w-md text-heading-sm font-semibold sm:text-heading-lg"
            >
              {t("heading")}
            </h2>
          </div>
          <p className="max-w-md text-body-sm text-ink-muted lg:col-span-5 lg:col-start-8 lg:justify-self-end lg:text-right">
            {t("aside")}
          </p>
        </div>

        <WhyChooseClient items={items} />
      </Container>
    </section>
  );
}

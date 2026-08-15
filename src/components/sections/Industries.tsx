import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { IndustriesClient } from "./IndustriesClient";

export async function Industries() {
  const t = await getTranslations("industries");
  const items = t.raw("items") as string[];

  return (
    <section
      aria-labelledby="industries-heading"
      className="border-b border-line bg-base py-12 lg:py-16"
    >
      <Container>
        <div className="grid items-end gap-3 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("label")}
            </p>
            <h2
              id="industries-heading"
              className="mt-2 max-w-xl text-heading-sm font-semibold sm:text-heading-lg"
            >
              {t("heading")}
            </h2>
          </div>
          <p className="max-w-md text-body-sm text-ink-muted lg:col-span-4 lg:col-start-9 lg:justify-self-end lg:text-right">
            {t("aside")}
          </p>
        </div>

        <IndustriesClient items={items} />
      </Container>
    </section>
  );
}

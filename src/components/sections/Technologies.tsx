import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { TechnologiesPanel } from "./TechnologiesPanel";

export async function Technologies() {
  const t = await getTranslations("technologies");

  return (
    <section
      aria-labelledby="technologies-heading"
      className="border-b border-line bg-surface py-12 lg:py-16"
    >
      <Container>
        <div className="grid min-w-0 items-end gap-3 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-7">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("label")}
            </p>
            <h2
              id="technologies-heading"
              className="mt-2 max-w-xl text-heading-sm font-semibold break-words sm:text-heading-lg"
            >
              {t("heading")}
            </h2>
          </div>
          <p className="max-w-md text-body-sm text-ink-muted lg:col-span-4 lg:col-start-9 lg:justify-self-end lg:text-right">
            {t("aside")}
          </p>
        </div>

        <TechnologiesPanel />
      </Container>
    </section>
  );
}

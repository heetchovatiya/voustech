import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";

const industryIcons: IconName[] = [
  "life-buoy", // Healthcare
  "users", // Education
  "cart", // Retail
  "share", // Restaurants
  "map-pin", // Real Estate
  "wrench", // Construction
  "credit-card", // Finance
  "cpu", // Manufacturing
  "layers", // Logistics
  "users", // NGOs
  "globe", // Government
  "compass", // Travel
  "hotel", // Hospitality
  "zap", // Agriculture
  "diamond", // Mining
  "smartphone", // Telecommunications
];

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

        <ul className="mt-8 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const index = String(i + 1).padStart(2, "0");

            return (
              <li key={item} className="border-b border-r border-line">
                <Reveal delayMs={(i % 4) * 40} className="h-full">
                  <article className="group flex h-full items-center gap-3 px-4 py-4 transition-colors duration-150 hover:bg-tech-blue/[0.04] sm:px-5">
                    <span className="shrink-0 font-mono text-body-sm font-medium tracking-[0.08em] text-tech-blue">
                      {index}
                    </span>
                    <h3 className="min-w-0 flex-1 text-body-sm font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                      {item}
                    </h3>
                    <span className="shrink-0 text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
                      <Icon
                        name={industryIcons[i % industryIcons.length]}
                        size={18}
                      />
                    </span>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

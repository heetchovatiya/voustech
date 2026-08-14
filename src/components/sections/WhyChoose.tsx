import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";

const icons: IconName[] = [
  "users",
  "cpu",
  "life-buoy",
  "lock",
  "compass",
  "credit-card",
  "gauge",
  "layers",
  "share",
  "mail",
];

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

        <ul className="mt-7 grid border-t border-line sm:grid-cols-2">
          {items.map((item, i) => {
            const index = String(i + 1).padStart(2, "0");
            const isLeft = i % 2 === 0;

            return (
              <li
                key={item.title}
                className={`border-b border-line ${
                  isLeft ? "sm:border-r sm:pr-6 lg:pr-8" : "sm:pl-6 lg:pl-8"
                }`}
              >
                <Reveal delayMs={(i % 2) * 60}>
                  <article className="group flex gap-3 py-4 sm:gap-4 sm:py-5">
                    <span className="shrink-0 font-mono text-body-lg font-medium tracking-[0.08em] text-tech-blue">
                      {index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-body font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                          {item.title}
                        </h3>
                        <span className="mt-0.5 shrink-0 text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
                          <Icon name={icons[i % icons.length]} size={22} />
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-sm text-body-sm leading-relaxed text-ink-muted">
                        {item.body}
                      </p>
                    </div>
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

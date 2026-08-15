import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";

const pillars: { key: "mission" | "vision" | "whyExist"; icon: IconName }[] = [
  { key: "mission", icon: "compass" },
  { key: "vision", icon: "globe" },
  { key: "whyExist", icon: "zap" },
];

export async function AboutPreview() {
  const t = await getTranslations("about");

  return (
    <section
      aria-labelledby="about-heading"
      className="border-b border-line bg-base py-12 lg:py-16"
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("label")}
            </p>
            <h2
              id="about-heading"
              className="mt-2 text-heading-sm font-semibold sm:text-heading-lg"
            >
              {t("heading")}
            </h2>
            <p className="mt-4 max-w-md 2xl:max-w-xl text-body-sm leading-relaxed text-ink-muted sm:text-body">
              {t("body")}
            </p>
            <div className="mt-7">
              <Button href="/about" variant="secondary" showArrow>
                {t("learnMore")}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul>
              {pillars.map((pillar, i) => (
                <li
                  key={pillar.key}
                  className={i < pillars.length - 1 ? "border-b border-line" : ""}
                >
                  <Reveal delayMs={i * 70}>
                    <article className="group grid grid-cols-[auto_1fr] gap-4 py-5 sm:gap-5 sm:py-6">
                      <span className="mt-0.5 text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
                        <Icon name={pillar.icon} size={22} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-body-lg font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                          {t(`${pillar.key}.title`)}
                        </h3>
                        <p className="mt-1.5 max-w-xl 2xl:max-w-3xl text-body-sm leading-relaxed text-ink-muted">
                          {t(`${pillar.key}.body`)}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroSignalMark } from "./HeroSignalMark";
import { HeroOrbitTechs } from "./HeroOrbitTechs";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section aria-labelledby="hero-heading" className="border-b border-line bg-base">
      <Container className="grid items-center gap-12 py-14 lg:grid-cols-12 lg:gap-14 lg:py-20">
        <div className="lg:col-span-6 xl:col-span-7">
          <h1
            id="hero-heading"
            className="max-w-xl text-heading-lg font-semibold leading-[1.1] sm:text-display"
          >
            {t("title")}
          </h1>
          <p className="mt-5 max-w-lg text-body text-ink-muted sm:text-body-lg">
            {t("subhead")}
          </p>
          <p className="mt-3 max-w-lg text-body-sm leading-relaxed text-ink-muted">
            {t("body")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact" showArrow>
              {t("ctaPrimary")}
            </Button>
            <Button href="/portfolio" variant="secondary" showArrow>
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5">
          <div
            className="hero-signal relative mx-auto aspect-square w-full max-w-[32rem] lg:ml-auto lg:mr-0"
            aria-hidden="true"
          >
            <div className="hero-signal-ring hero-signal-ring-outer" />
            <div className="hero-signal-ring hero-signal-ring-mid" />
            <div className="hero-signal-sweep" />
            <HeroOrbitTechs />

            <div className="absolute inset-0 z-[1] flex items-center justify-center">
              <div className="hero-signal-core flex size-[13rem] items-center justify-center rounded-full sm:size-[15rem]">
                <HeroSignalMark />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

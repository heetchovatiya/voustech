import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";

const stepIcons: IconName[] = [
  "compass",
  "layers",
  "pen-tool",
  "code",
  "check",
  "zap",
  "life-buoy",
];

export async function Process() {
  const t = await getTranslations("process");
  const steps = t.raw("steps") as { number: string; title: string; body: string }[];

  return (
    <section
      aria-labelledby="process-heading"
      className="border-b border-line bg-surface py-12 lg:py-16"
    >
      <Container>
        <div className="grid items-end gap-3 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("label")}
            </p>
            <h2
              id="process-heading"
              className="mt-2 max-w-lg text-heading-sm font-semibold sm:text-heading-lg"
            >
              {t("heading")}
            </h2>
          </div>
          <p className="max-w-md text-body-sm text-ink-muted lg:col-span-4 lg:col-start-9 lg:justify-self-end lg:text-right">
            {t("aside")}
          </p>
        </div>

        <ol className="relative mt-10 border-t border-line">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;

            return (
              <li key={step.number} className="relative">
                <Reveal delayMs={Math.min(i * 50, 200)}>
                  <article className="group grid grid-cols-[auto_1fr] gap-4 py-5 sm:grid-cols-[5rem_auto_1fr] sm:gap-6 sm:py-6 lg:gap-8">
                    {/* Index + timeline rail */}
                    <div className="relative flex flex-col items-start">
                      <span className="relative z-10 font-mono text-body-lg font-medium tracking-[0.08em] text-tech-blue sm:text-heading-sm">
                        {step.number}
                      </span>
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[0.7rem] top-8 hidden h-[calc(100%+0.25rem)] w-px bg-line sm:left-[1.1rem] sm:top-10 sm:block"
                        />
                      )}
                    </div>

                    {/* Icon */}
                    <span className="mt-1 hidden text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean sm:block">
                      <Icon name={stepIcons[i % stepIcons.length]} size={22} />
                    </span>

                    {/* Copy */}
                    <div
                      className={`min-w-0 pb-5 sm:pb-6 ${
                        isLast ? "" : "border-b border-line"
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:block">
                        <span className="text-tech-blue sm:hidden">
                          <Icon name={stepIcons[i % stepIcons.length]} size={18} />
                        </span>
                        <h3 className="text-body-lg font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 max-w-2xl text-body-sm leading-relaxed text-ink-muted">
                        {step.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

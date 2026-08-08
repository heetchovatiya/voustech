import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

const placeholderSlots = Array.from({ length: 6 }, (_, i) => i + 1);

export async function TrustedByMarquee() {
  const t = await getTranslations("trustedBy");

  return (
    <section aria-label={t("label")} className="border-b border-line bg-surface py-10">
      <Container>
        <p className="mb-6 text-center font-mono text-label uppercase tracking-[0.12em] text-ink-muted">
          {t("label")}
        </p>

        {/* Static grid by default for a11y; animated track only when motion is allowed */}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {placeholderSlots.map((slot) => (
            <li
              key={slot}
              className="flex h-12 items-center justify-center rounded-sm border border-dashed border-line font-mono text-label text-ink-muted"
            >
              Client {slot}
            </li>
          ))}
        </ul>
      </Container>

      <div className="relative hidden overflow-hidden lg:block" aria-hidden="true">
        <div className="flex w-max motion-safe:animate-marquee motion-reduce:animate-none gap-12">
          {[...placeholderSlots, ...placeholderSlots].map((slot, i) => (
            <div
              key={`${slot}-${i}`}
              className="flex h-12 w-40 shrink-0 items-center justify-center rounded-sm border border-dashed border-line font-mono text-label text-ink-muted"
            >
              Client {slot}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

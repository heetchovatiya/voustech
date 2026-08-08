import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons/Icon";

export async function Testimonials() {
  const t = await getTranslations("testimonials");
  const items = t.raw("items") as { quote: string; name: string; role: string }[];

  return (
    <section aria-labelledby="testimonials-heading" className="border-b border-line bg-surface py-16 lg:py-24">
      <Container>
        <p className="mb-3 font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
          {t("label")}
        </p>
        <h2 id="testimonials-heading" className="sr-only">
          {t("label")}
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <figure key={item.name} className="flex flex-col rounded-sm border border-line bg-base p-6">
              <div className="flex gap-1 text-tech-blue" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={14} />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-body-sm text-ink">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-body-sm">
                <span className="font-semibold text-ink">{item.name}</span>
                <span className="text-ink-muted">, {item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

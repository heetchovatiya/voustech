import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons/Icon";
import { db } from "@/lib/db";

export async function Testimonials() {
  const t = await getTranslations("testimonials");
  const fallbackItems = t.raw("items") as { quote: string; name: string; role: string }[];

  let dbTestimonials: { id: string; clientName: string; clientRole: string; company: string; avatarUrl?: string | null; content: string; rating: number }[] = [];
  try {
    dbTestimonials = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[testimonials-db-error]", err);
  }

  const items = dbTestimonials.length > 0
    ? dbTestimonials.map((t) => ({
        id: t.id,
        quote: t.content,
        name: t.clientName,
        role: `${t.clientRole}, ${t.company}`,
        rating: t.rating,
        avatarUrl: t.avatarUrl,
      }))
    : fallbackItems.map((item, idx) => ({
        id: `fallback-${idx}`,
        quote: item.quote,
        name: item.name,
        role: item.role,
        rating: 5,
        avatarUrl: null,
      }));

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
            <figure key={item.id} className="flex flex-col rounded-sm border border-line bg-base p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-tech-blue" aria-hidden="true">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Icon key={i} name="star" size={14} />
                  ))}
                </div>
                {item.avatarUrl && (
                  <img src={item.avatarUrl} alt={item.name} className="h-8 w-8 rounded-full object-cover border border-line" />
                )}
              </div>
              <blockquote cite="https://voustech.com/portfolio" className="mt-3 flex-1 text-body-sm text-ink">
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

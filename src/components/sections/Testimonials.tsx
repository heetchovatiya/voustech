import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons/Icon";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site.config";

export async function Testimonials() {
  const t = await getTranslations("testimonials");
  const tFounding = await getTranslations("about");

  let dbTestimonials: { id: string; clientName: string; clientRole: string; company: string; avatarUrl?: string | null; content: string; rating: number }[] = [];
  try {
    dbTestimonials = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[testimonials-db-error]", err);
  }

  const hasRealTestimonials = dbTestimonials.length > 0;

  return (
    <section aria-labelledby="testimonials-heading" className="border-b border-line bg-surface py-16 lg:py-24">
      <Container>
        <p className="mb-3 font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
          {t("label")}
        </p>
        <h2 id="testimonials-heading" className="sr-only">
          {t("label")}
        </h2>

        {hasRealTestimonials ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {dbTestimonials.map((item) => (
              <figure key={item.id} className="flex flex-col rounded-sm border border-line bg-base p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-tech-blue" aria-hidden="true">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Icon key={i} name="star" size={14} />
                    ))}
                  </div>
                  {item.avatarUrl && (
                    <img src={item.avatarUrl} alt={item.clientName} className="h-8 w-8 rounded-full object-cover border border-line" />
                  )}
                </div>
                <blockquote cite={`${siteConfig.url}/portfolio`} className="mt-3 flex-1 text-body-sm text-ink">
                  &ldquo;{item.content}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-body-sm">
                  <span className="font-semibold text-ink">{item.clientName}</span>
                  <span className="text-ink-muted">, {item.clientRole}, {item.company}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-tech-blue/30 bg-tech-blue/5 p-8 text-center sm:p-10">
            <div className="mx-auto max-w-2xl space-y-4">
              <span className="inline-block rounded-full bg-tech-blue/10 px-3 py-1 font-mono text-xs font-semibold text-tech-blue uppercase tracking-wider">
                Founding Client Partner Program 🚀
              </span>
              <h3 className="text-heading-sm font-display font-semibold text-ink">
                Be Our Next Showcase Case Study
              </h3>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                We are currently onboarding our founding partners for 2026. Enjoy direct senior engineering access, 100% source code ownership, priority SLA support, and preferential launch rates.
              </p>
              <div className="pt-2">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-tech-blue px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-deep-ocean"
                >
                  <span>Apply for Founding Rates &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

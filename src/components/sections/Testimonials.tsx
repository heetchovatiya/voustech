import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { TestimonialsClient, type TestimonialItem } from "./TestimonialsClient";
import { db } from "@/lib/db";

export async function Testimonials() {
  const t = await getTranslations("testimonials");

  let dbTestimonials: TestimonialItem[] = [];
  try {
    const records = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (records.length > 0) {
      dbTestimonials = records.map((r) => ({
        id: r.id,
        clientName: r.clientName,
        clientRole: r.clientRole,
        company: r.company,
        avatarUrl: r.avatarUrl,
        content: r.content,
        rating: r.rating,
      }));
    }
  } catch (err) {
    console.error("[testimonials-db-error]", err);
  }

  // Fallback to localized content items if DB is empty
  const rawFallback = t.raw("items") as { quote: string; name: string; role: string }[];
  const fallbackTestimonials: TestimonialItem[] = Array.isArray(rawFallback)
    ? rawFallback.map((item, i) => {
        const parts = item.role.split(",");
        const role = parts[0]?.trim() || "Executive";
        const company = parts.slice(1).join(",").trim() || "Partner";
        return {
          id: `fallback-${i}`,
          clientName: item.name,
          clientRole: role,
          company,
          content: item.quote,
          rating: 5,
        };
      })
    : [];

  const displayItems = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  return (
    <section aria-labelledby="testimonials-heading" className="border-b border-line bg-surface py-16 lg:py-24">
      <Container>
        <p className="mb-3 font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
          {t("label")}
        </p>
        <h2 id="testimonials-heading" className="sr-only">
          {t("label")}
        </h2>

        <TestimonialsClient items={displayItems} />
      </Container>
    </section>
  );
}

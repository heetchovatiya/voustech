import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JsonLd, faqJsonLd } from "@/lib/jsonld";
import { FaqAccordion } from "./FaqAccordion";
import { db } from "@/lib/db";

export async function FaqSection() {
  const t = await getTranslations("faq");
  const fallbackItems = t.raw("items") as { question: string; answer: string }[];

  let dbFaqs: { question: string; answer: string }[] = [];
  try {
    const faqs = await db.faq.findMany({
      where: { hidden: false },
      orderBy: { displayOrder: "asc" },
    });
    if (faqs.length > 0) {
      dbFaqs = faqs.map((f) => ({ question: f.question, answer: f.answer }));
    }
  } catch (err) {
    console.error("[faq-section-db-error]", err);
  }

  const items = dbFaqs.length > 0 ? dbFaqs : fallbackItems;

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b border-line bg-base py-12 lg:py-16"
    >
      <JsonLd data={faqJsonLd(items)} />
      <Container>
        <div className="grid items-end gap-3 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("label")}
            </p>
            <h2
              id="faq-heading"
              className="mt-2 max-w-xl text-heading-sm font-semibold sm:text-heading-lg"
            >
              {t("heading")}
            </h2>
          </div>
          <p className="max-w-md text-body-sm text-ink-muted lg:col-span-4 lg:col-start-9 lg:justify-self-end lg:text-right">
            {t("aside")}
          </p>
        </div>

        <FaqAccordion items={items} />

        <div className="mt-8">
          <Button href="/contact" variant="secondary" showArrow>
            {t("cta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

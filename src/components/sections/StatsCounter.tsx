import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { stats as fallbackStats } from "@/content/stats";
import { db } from "@/lib/db";

export async function StatsCounter() {
  let t: ((key: string) => string) | null = null;
  try {
    t = await getTranslations("stats.items");
  } catch {
    t = (k: string) => k;
  }

  let dbMetrics: { id: string; label: string; value: string; suffix?: string | null }[] = [];
  try {
    dbMetrics = await db.companyMetric.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (err) {
    console.error("[stats-counter-db-error]", err);
  }

  const items = dbMetrics.length > 0
    ? dbMetrics.map((m) => {
        const numericVal = parseInt(m.value.replace(/[^0-9]/g, ""), 10);
        return {
          key: m.id,
          label: m.label,
          numericValue: isNaN(numericVal) ? null : numericVal,
          rawValue: m.value,
          suffix: m.suffix || "",
        };
      })
    : fallbackStats.map((s) => ({
        key: s.key,
        label: t ? t(s.key) : s.key,
        numericValue: s.value !== undefined ? s.value : null,
        rawValue: s.rawValue || (s.value !== undefined ? String(s.value) : ""),
        suffix: s.suffix,
      }));

  return (
    <section aria-label="Company statistics" className="border-b border-line bg-primary-dark py-14">
      <Container>
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-5">
          {items.map((stat) => (
            <div key={stat.key}>
              <dd className="font-display text-heading-lg font-semibold text-white">
                {stat.numericValue !== null ? (
                  <CountUp value={stat.numericValue} suffix={stat.suffix} />
                ) : (
                  <span>{stat.rawValue}{stat.suffix}</span>
                )}
              </dd>
              <dt className="mt-2 text-body-sm text-white/70">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}


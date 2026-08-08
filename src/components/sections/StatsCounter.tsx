import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { stats } from "@/content/stats";

export async function StatsCounter() {
  const t = await getTranslations("stats.items");

  return (
    <section aria-label="Company statistics" className="border-b border-line bg-primary-dark py-14">
      <Container>
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.key}>
              <dd className="font-display text-heading-lg font-semibold text-white">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-2 text-body-sm text-white/70">{t(stat.key)}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { db } from "@/lib/db";

export async function TrustedByMarquee() {
  const t = await getTranslations("trustedBy");

  let logos: { id: string; name: string; logoUrl: string; websiteUrl?: string | null }[] = [];
  try {
    logos = await db.clientLogo.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (err) {
    console.error("[trusted-by-db-error]", err);
  }

  if (logos.length === 0) {
    return null;
  }

  const marqueeItems = [...logos, ...logos];

  return (
    <section aria-label={t("label")} className="border-b border-line bg-surface py-10">
      <Container>
        <p className="mb-6 text-center font-mono text-label uppercase tracking-[0.12em] text-ink-muted">
          {t("label")}
        </p>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {logos.map((logo) => (
            <li
              key={logo.id}
              className="flex h-14 items-center justify-center gap-2.5 rounded border border-line bg-surface-elevated px-4 font-mono text-label text-ink"
            >
              <img src={logo.logoUrl} alt={logo.name} className="h-5 w-5 object-contain" />
              <span className="font-semibold text-xs">{logo.name}</span>
            </li>
          ))}
        </ul>
      </Container>

      <div className="relative hidden overflow-hidden lg:block" aria-hidden="true">
        <div className="flex w-max motion-safe:animate-marquee motion-reduce:animate-none gap-8">
          {marqueeItems.map((logo, i) => (
            <div
              key={`${logo.id}-${i}`}
              className="flex h-14 w-44 shrink-0 items-center justify-center gap-2.5 rounded border border-line bg-surface-elevated px-4 font-mono text-label text-ink shadow-sm"
            >
              <img src={logo.logoUrl} alt={logo.name} className="h-5 w-5 object-contain" />
              <span className="font-semibold text-xs">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


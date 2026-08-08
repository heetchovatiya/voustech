import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { PageIntro } from "@/components/ui/PageIntro";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ContactSection } from "@/components/sections/ContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.blog" });
  return buildMetadata({ locale, path: "/blog", title: t("title"), description: t("description") });
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tNav = await getTranslations("nav");

  const posts = t.raw("posts") as {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
  }[];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          { name: tNav("blog"), url: `${siteConfig.url}/${locale}/blog` },
        ])}
      />
      <PageIntro label={t("label")} heading={t("heading")} body={t("intro")} />

      <section className="border-b border-line bg-base py-12 lg:py-16">
        <Container>
          <p className="mb-6 font-mono text-label uppercase tracking-[0.14em] text-ink-muted">
            {t("indexLabel")}
          </p>

          <ul className="border-t border-line">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-line">
                <article className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:py-8">
                  <div className="min-w-0 max-w-2xl">
                    <time
                      dateTime={post.date}
                      className="text-body-sm text-ink-muted"
                    >
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h2 className="mt-2 text-heading-sm font-display font-semibold tracking-tight transition-colors duration-150 group-hover:text-tech-blue">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
                      {post.excerpt}
                    </p>
                  </div>

                  <Button
                    href={`/blog/${post.slug}`}
                    variant="secondary"
                    showArrow
                    className="!px-4 !py-2.5 sm:shrink-0"
                  >
                    {t("readMore")}
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}

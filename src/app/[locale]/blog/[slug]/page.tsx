import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site.config";
import { PageIntro } from "@/components/ui/PageIntro";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ContactSection } from "@/components/sections/ContactSection";
import { routing } from "@/i18n/routing";
import enMessages from "@/messages/en.json";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string[];
}

export function generateStaticParams() {
  const slugs = enMessages.blog.posts.map((p) => p.slug);
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = t.raw("posts") as BlogPost[];
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${post.title} | VousTech Blog`,
    description: post.excerpt,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tNav = await getTranslations("nav");
  const posts = t.raw("posts") as BlogPost[];
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const morePosts = posts.filter((p) => p.slug !== slug).slice(0, 2);
  const [lead, ...rest] = post.body;
  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tNav("home"), url: `${siteConfig.url}/${locale}` },
          { name: tNav("blog"), url: `${siteConfig.url}/${locale}/blog` },
          { name: post.title, url: `${siteConfig.url}/${locale}/blog/${slug}` },
        ])}
      />

      <PageIntro label={t("label")} heading={post.title} body={post.excerpt}>
        <time dateTime={post.date} className="text-body-sm text-ink-muted">
          {formattedDate}
        </time>
        <Button href="/blog" variant="ghost" showArrow>
          {t("backToBlog")}
        </Button>
      </PageIntro>

      <article className="border-b border-line bg-base py-14 lg:py-20">
        <Container className="max-w-2xl">
          {lead && (
            <p className="text-body-lg font-medium leading-relaxed text-ink">{lead}</p>
          )}

          <div className="mt-8 space-y-5">
            {rest.map((paragraph, i) => (
              <p key={i} className="text-body leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <Button href="/blog" variant="secondary" showArrow>
              {t("backToBlog")}
            </Button>
          </div>
        </Container>
      </article>

      {morePosts.length > 0 && (
        <section className="border-b border-line bg-surface py-14 lg:py-16">
          <Container>
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("morePosts")}
            </p>
            <ul className="mt-6 border-t border-line">
              {morePosts.map((item) => (
                <li key={item.slug} className="border-b border-line">
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group flex flex-col gap-1 py-5 transition-colors duration-150 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
                  >
                    <span className="min-w-0">
                      <time
                        dateTime={item.date}
                        className="text-body-sm text-ink-muted"
                      >
                        {new Date(item.date).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span className="mt-1 block text-body font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                        {item.title}
                      </span>
                    </span>
                    <span className="text-body-sm font-semibold text-tech-blue sm:shrink-0">
                      {t("readMore")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <ContactSection />
    </>
  );
}

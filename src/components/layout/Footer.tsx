import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/icons/Icon";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { siteConfig } from "@/lib/site.config";

const socialLinks: { name: string; href: string; icon: IconName }[] = [
  { name: "LinkedIn", href: siteConfig.social.linkedin, icon: "linkedin" },
  { name: "Facebook", href: siteConfig.social.facebook, icon: "facebook" },
  { name: "Instagram", href: siteConfig.social.instagram, icon: "instagram" },
  { name: "X (Twitter)", href: siteConfig.social.x, icon: "x-twitter" },
  {
    name: "WhatsApp Business",
    href: `https://wa.me/${siteConfig.whatsappNumber}`,
    icon: "whatsapp",
  },
];

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const quickLinks: { href: string; label: string }[] = [
    { href: "/", label: tNav("home") },
    { href: "/about", label: tNav("about") },
    { href: "/services", label: tNav("services") },
    { href: "/portfolio", label: tNav("portfolio") },
    { href: "/blog", label: tNav("blog") },
    { href: "/contact", label: tNav("contact") },
  ];

  const serviceLinks: { href: string; label: string }[] = [
    { href: "/services/website-development", label: t("servicesLinks.webDevelopment") },
    { href: "/services/mobile-app-development", label: t("servicesLinks.mobileApps") },
    { href: "/services/ui-ux-design", label: t("servicesLinks.uiUxDesign") },
    { href: "/services/cloud-solutions", label: t("servicesLinks.cloudSolutions") },
    { href: "/services/digital-marketing", label: t("servicesLinks.digitalMarketing") },
  ];

  const resourceLinks: { href: string; label: string }[] = [
    { href: "/blog", label: t("resourcesLinks.blog") },
    { href: "/portfolio", label: t("resourcesLinks.caseStudies") },
    { href: "/#faq", label: t("resourcesLinks.faqs") },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Service" },
  ];

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo variant="lockup" />
          <p className="mt-4 max-w-xs text-body-sm text-ink-muted">{t("tagline")}</p>
          <p className="mt-2 text-label font-mono text-tech-blue">📍 Kinshasa, Democratic Republic of Congo 🇨🇩</p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="flex size-9 items-center justify-center rounded-sm border border-line text-ink-muted transition-colors duration-150 hover:border-tech-blue hover:text-tech-blue"
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title={t("quickLinksTitle")} links={quickLinks} />
        <FooterColumn title={t("servicesTitle")} links={serviceLinks} />
        <FooterColumn title={t("resourcesTitle")} links={resourceLinks} />
      </Container>

      <Container className="border-t border-line py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-body-sm font-medium text-ink">{t("newsletter.title")}</p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
          <p className="text-body-sm text-ink-muted">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-mono text-label uppercase tracking-[0.1em] text-ink-muted">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-body-sm text-ink-muted transition-colors duration-150 hover:text-tech-blue"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/icons/Icon";
import { ContactForm } from "./ContactForm";
import { siteConfig } from "@/lib/site.config";

const socialLinks: { name: string; href: string; icon: IconName }[] = [
  { name: "LinkedIn", href: siteConfig.social.linkedin, icon: "linkedin" },
  { name: "Facebook", href: siteConfig.social.facebook, icon: "facebook" },
  { name: "Instagram", href: siteConfig.social.instagram, icon: "instagram" },
  { name: "X (Twitter)", href: siteConfig.social.x, icon: "x-twitter" },
];

export async function ContactSection({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const t = await getTranslations("contact");
  const HeadingTag = isStandalonePage ? "h1" : "h2";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-b border-line bg-surface py-12 lg:py-16"
    >
      <Container className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
        <div className="min-w-0">
          {!isStandalonePage && (
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {t("label")}
            </p>
          )}
          <HeadingTag
            id="contact-heading"
            className={`text-heading-sm font-semibold sm:text-heading-lg ${
              isStandalonePage ? "" : "mt-2"
            }`}
          >
            {t("heading")}
          </HeadingTag>
          <p className="mt-4 text-body text-ink-muted">{t("body")}</p>

          <div className="mt-8">
            <h3 className="font-mono text-label uppercase tracking-[0.1em] text-ink-muted">
              {t("businessHours.title")}
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-body-sm text-ink">
              <li className="flex items-center gap-2">
                <Icon name="clock" size={15} className="shrink-0 text-tech-blue" />
                {t("businessHours.weekdays")}
              </li>
              <li className="pl-[23px] text-ink-muted">{t("businessHours.saturday")}</li>
              <li className="pl-[23px] text-ink-muted">{t("businessHours.sunday")}</li>
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="font-mono text-label uppercase tracking-[0.1em] text-ink-muted">
              {t("connect")}
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
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

          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-sm border border-tech-blue px-6 py-3 text-body-sm font-semibold text-ink transition-colors duration-150 hover:border-deep-ocean hover:bg-tech-blue hover:text-white"
          >
            <Icon
              name="whatsapp"
              size={18}
              className="text-tech-blue transition-colors duration-150 group-hover:text-white"
            />
            {t("whatsappCta")}
          </a>
        </div>

        <div className="min-w-0 rounded-sm border border-line bg-base p-5 sm:p-8">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

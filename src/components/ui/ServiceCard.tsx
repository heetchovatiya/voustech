import { Icon, type IconName } from "@/components/icons/Icon";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export function ServiceCard({
  slug,
  icon,
  title,
  hook,
  body,
  cta,
}: {
  slug: string;
  icon: IconName;
  title: string;
  hook: string;
  body: string;
  cta: string;
}) {
  return (
    <article className="group flex h-full flex-col border-t border-line pt-5 transition-colors duration-150">
      <div className="flex size-10 items-center justify-center text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
        <Icon name={icon} size={22} />
      </div>
      <h3 className="mt-4 text-body-lg font-display font-semibold">
        <Link href={`/services/${slug}`} className="transition-colors duration-150 hover:text-tech-blue">
          {title}
        </Link>
      </h3>
      <p className="mt-2 text-body-sm font-medium text-ink">{hook}</p>
      <p className="mt-2 flex-1 text-body-sm leading-relaxed text-ink-muted">{body}</p>
      <div className="mt-5">
        <Button href="/contact" variant="secondary" showArrow className="!px-4 !py-2.5">
          {cta}
        </Button>
      </div>
    </article>
  );
}

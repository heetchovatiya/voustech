import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons/Icon";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
  href?: string;
}

const base =
  "group inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-body-sm font-semibold tracking-wide transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-cta text-cta-ink border border-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] hover:bg-cta-hover hover:shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--color-deep-ocean)_70%,transparent)] focus-visible:outline-cta",
  secondary:
    "border border-tech-blue bg-transparent text-ink hover:border-deep-ocean hover:bg-tech-blue hover:text-white focus-visible:outline-tech-blue",
  ghost:
    "gap-1.5 border-transparent bg-transparent px-0 py-0 text-ink shadow-none underline-offset-4 hover:text-tech-blue hover:underline focus-visible:outline-tech-blue active:translate-y-0",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  showArrow = false,
  href,
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <Icon
          name="arrow-right"
          size={16}
          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}

import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo({
  variant = "responsive",
}: {
  /** `lockup` always shows the full wordmark (e.g. footer). */
  variant?: "responsive" | "lockup";
}) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 opacity-100 transition-opacity duration-150 hover:opacity-80 shrink-0"
      aria-label="VousTech home"
    >
      <Image
        src="/brand/logo-mark.png"
        alt="VousTech"
        width={36}
        height={36}
        priority
        className="h-8 w-auto object-contain"
      />
      <span className="font-display text-xl font-bold tracking-tight text-ink">
        Vous<span className="text-tech-blue">Tech</span>
      </span>
    </Link>
  );
}

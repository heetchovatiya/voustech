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
      className="flex items-center opacity-100 transition-opacity duration-150 hover:opacity-80 shrink-0"
      aria-label="VousTech home"
    >
      {/* Light Mode Lockup Logo */}
      <Image
        src="/brand/logo-lockup-light.png"
        alt="VousTech"
        width={192}
        height={108}
        priority
        className="h-8 sm:h-9 w-auto dark:hidden object-contain"
      />

      {/* Dark Mode Lockup Logo */}
      <Image
        src="/brand/logo-lockup-dark.png"
        alt="VousTech"
        width={192}
        height={108}
        priority
        className="hidden h-8 sm:h-9 w-auto dark:block object-contain brightness-110"
      />
    </Link>
  );
}

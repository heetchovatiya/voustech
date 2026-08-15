import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo({
  variant = "responsive",
}: {
  /** `lockup` always shows the full wordmark (e.g. footer). */
  variant?: "responsive" | "lockup";
}) {
  const lockupOnly = variant === "lockup";

  return (
    <Link
      href="/"
      className="flex items-center opacity-100 transition-opacity duration-150 hover:opacity-80"
      aria-label="VousTech home"
    >
      {/* Light Mode Logo (Visible in Light Theme) */}
      <Image
        src="/brand/logo-lockup-light.png"
        alt="VousTech"
        width={192}
        height={108}
        priority={!lockupOnly}
        className={`dark:hidden ${lockupOnly ? "h-10 w-auto" : "hidden h-9 w-auto sm:block"}`}
      />

      {/* Dark Mode Logo (Visible in Dark Theme) */}
      <Image
        src="/brand/logo-lockup-dark.png"
        alt="VousTech"
        width={192}
        height={108}
        priority={!lockupOnly}
        className={`hidden dark:block ${lockupOnly ? "h-10 w-auto" : "hidden h-9 w-auto sm:dark:block"}`}
      />

      {/* Mobile Icon Mark */}
      {!lockupOnly && (
        <Image
          src="/brand/logo-mark.png"
          alt="VousTech"
          width={100}
          height={83}
          priority
          className="h-8 w-auto sm:hidden"
        />
      )}
    </Link>
  );
}

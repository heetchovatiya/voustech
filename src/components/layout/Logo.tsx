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
      {/* Light Mode Logo (Darkened for maximum visibility on white/light backgrounds) */}
      <Image
        src="/brand/logo-lockup-light.png"
        alt="VousTech"
        width={192}
        height={108}
        priority={!lockupOnly}
        className={`dark:hidden brightness-[0.3] contrast-[2] ${lockupOnly ? "h-10 w-auto" : "hidden h-9 w-auto sm:block"}`}
      />

      {/* Dark Mode Logo (Brightened for dark background) */}
      <Image
        src="/brand/logo-lockup-dark.png"
        alt="VousTech"
        width={192}
        height={108}
        priority={!lockupOnly}
        className={`hidden dark:block brightness-125 contrast-125 ${lockupOnly ? "h-10 w-auto" : "hidden h-9 w-auto sm:dark:block"}`}
      />

      {/* Mobile Icon Mark & Crisp Wordmark */}
      {!lockupOnly && (
        <div className="flex items-center gap-2 sm:hidden">
          <Image
            src="/brand/logo-mark.png"
            alt="VousTech"
            width={100}
            height={83}
            priority
            className="h-8 w-auto"
          />
          <span className="font-display text-body-lg font-bold tracking-[0.14em] uppercase text-deep-ocean dark:text-white">
            VOUS<span className="text-tech-blue">TECH</span>
          </span>
        </div>
      )}
    </Link>
  );
}

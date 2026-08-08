"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ServicesDesktopNav, ServicesMobileNav } from "./ServicesMenu";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services", mega: true },
  { href: "/portfolio", key: "portfolio" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Reset the mobile drawer when the route changes — adjusted during render
  // (React's documented pattern) rather than in an effect, since it's a
  // direct response to a prop change, not a sync with an external system.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur-md supports-[backdrop-filter]:bg-base/80">
        <Container className="flex h-16 items-center justify-between gap-3">
          <Logo />

          <nav aria-label={t("primaryNav")} className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              if ("mega" in item && item.mega) {
                return <ServicesDesktopNav key={item.href} />;
              }

              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-body-sm font-medium transition-colors duration-150 ${
                    active ? "text-tech-blue" : "text-ink hover:text-tech-blue"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button href="/contact" showArrow className="!py-2.5">
              {t("cta")}
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className={`relative flex size-9 items-center justify-center rounded-sm border transition-colors duration-200 ${
                open
                  ? "border-tech-blue bg-tech-blue text-white"
                  : "border-line text-ink hover:border-tech-blue hover:text-tech-blue"
              }`}
            >
              <span
                className={`absolute h-[1.5px] w-4 origin-center bg-current transition-transform duration-200 ease-out ${
                  open ? "translate-y-0 rotate-45" : "-translate-y-[4.5px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-opacity duration-150 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 origin-center bg-current transition-transform duration-200 ease-out ${
                  open ? "translate-y-0 -rotate-45" : "translate-y-[4.5px]"
                }`}
              />
            </button>
          </div>
        </Container>
      </header>

      {/* Outside header: backdrop-blur creates a containing block that breaks fixed positioning. */}
      <div
        className={`fixed inset-0 z-40 bg-ink/35 transition-opacity duration-200 ease-out lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-nav"
        className={`fixed inset-y-0 right-0 z-40 flex w-[min(20rem,88vw)] flex-col bg-base shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        // Keep the off-screen drawer non-focusable / out of the a11y tree
        // while closed (avoids agent-accessibility-tree failures).
        inert={!open}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <p className="font-mono text-label uppercase tracking-[0.12em] text-ink-muted">
            {t("menu")}
          </p>
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={() => setOpen(false)}
            className="flex size-9 items-center justify-center rounded-sm border border-line text-ink transition-colors duration-150 hover:border-tech-blue hover:text-tech-blue"
          >
            <span className="relative block size-4">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav
          aria-label={t("mobileNav")}
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3"
        >
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              if ("mega" in item && item.mega) {
                return (
                  <li key={item.href}>
                    <ServicesMobileNav onNavigate={() => setOpen(false)} />
                  </li>
                );
              }

              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-sm px-3 py-2.5 text-body font-medium transition-colors duration-150 ${
                      active
                        ? "bg-tech-blue/10 text-tech-blue"
                        : "text-ink hover:bg-surface hover:text-tech-blue"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button href="/contact" showArrow className="w-full justify-center">
            {t("cta")}
          </Button>
        </div>
      </div>
    </>
  );
}

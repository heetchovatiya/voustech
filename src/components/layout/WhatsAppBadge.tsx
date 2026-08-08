"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons/Icon";
import { siteConfig } from "@/lib/site.config";

export function WhatsAppBadge() {
  const t = useTranslations("system");
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let raf = 0;

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY.current + 4;
        const goingUp = y < lastY.current - 4;
        if (goingDown) setHidden(true);
        else if (goingUp) setHidden(false);
        lastY.current = y;
        raf = 0;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappLabel")}
      className={`fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-[transform,filter] duration-200 ease-out hover:scale-105 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-8 sm:right-8 ${
        hidden ? "translate-y-24 sm:translate-y-0" : "translate-y-0"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] motion-safe:animate-pulse-ring"
      />
      <Icon name="whatsapp" size={28} className="relative" />
    </a>
  );
}

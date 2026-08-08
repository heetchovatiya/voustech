"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const t = useTranslations("footer.newsletter");
  const tForm = useTranslations("contact.form");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("success");
  }

  if (status === "success") {
    return <p className="text-body-sm text-tech-blue">{t("success")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm items-stretch gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        {t("placeholder")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={t("placeholder")}
        title={tForm("emailError")}
        className="min-w-0 flex-1 rounded-sm border border-line bg-transparent px-3 py-2 text-body-sm text-ink placeholder:text-ink-muted transition-colors duration-150 hover:border-tech-blue/50 focus-visible:border-tech-blue"
      />
      <Button type="submit" showArrow className="shrink-0 !px-4 !py-2">
        {t("subscribe")}
      </Button>
    </form>
  );
}

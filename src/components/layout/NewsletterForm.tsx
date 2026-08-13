"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const t = useTranslations("footer.newsletter");
  const tForm = useTranslations("contact.form");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Subscription failed");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Failed to subscribe");
    }
  }

  if (status === "success") {
    return <p className="text-body-sm text-emerald-400 font-semibold">{t("success")}</p>;
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex max-w-sm items-stretch gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          {t("placeholder")}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          title={tForm("emailError")}
          className="min-w-0 flex-1 rounded-sm border border-line bg-transparent px-3 py-2 text-body-sm text-ink placeholder:text-ink-muted transition-colors duration-150 hover:border-tech-blue/50 focus-visible:border-tech-blue"
        />
        <Button type="submit" showArrow disabled={status === "loading"} className="shrink-0 !px-4 !py-2">
          {status === "loading" ? "..." : t("subscribe")}
        </Button>
      </form>
      {status === "error" && <p className="text-xs text-rose-400">{errorMsg}</p>}
    </div>
  );
}

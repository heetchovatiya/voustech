import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../messages/en.json";
import fr from "../messages/fr.json";

const catalogs = {
  en,
  fr,
} as const;

type MessageTree = Record<string, unknown>;

/** Deep-merge so missing French keys fall back to English instead of raw key paths. */
function mergeMessages(base: MessageTree, override: MessageTree): MessageTree {
  const out: MessageTree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      out[key] = mergeMessages(current as MessageTree, value as MessageTree);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const localized = catalogs[locale as keyof typeof catalogs] ?? fr;
  const messages = locale === "en" ? en : mergeMessages(en as MessageTree, localized as MessageTree);

  return {
    locale,
    messages,
  };
});

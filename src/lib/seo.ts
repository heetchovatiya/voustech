import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "./site.config";

interface PageSeoInput {
  locale: string;
  /** Path without locale prefix, starting with "/", e.g. "/about" or "/". */
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogTitle,
  ogDescription,
}: PageSeoInput): Metadata {
  const languages: Record<string, string> = {};
  const defaultLocale = routing.defaultLocale;
  for (const loc of routing.locales) {
    languages[loc] = `${siteConfig.url}/${loc}${path === "/" ? "" : path}`;
  }
  languages["x-default"] = `${siteConfig.url}/${defaultLocale}${path === "/" ? "" : path}`;

  const canonical = `${siteConfig.url}/${locale}${path === "/" ? "" : path}`;
  const ogImage = {
    url: "/brand/logo-lockup-light.png",
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} — digital technology partner`,
  };

  return {
    title,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "technology",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [ogImage.url],
    },
    formatDetection: {
      telephone: true,
      email: true,
      address: false,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "-wknzWmJpBel55Wy76fRhR3QeCiHUIzIGEMEbNTCYW0",
    },
  };
}

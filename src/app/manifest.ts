import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description:
      "Websites, apps and digital systems for businesses across Africa and worldwide.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f4c75",
    lang: "en",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

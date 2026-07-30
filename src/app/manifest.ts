import type { MetadataRoute } from "next";
import { getSiteSetting } from "@/lib/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const logo = await getSiteSetting("branding.logo");
  const theme = await getSiteSetting("theme.colors");

  return {
    name: "Avepo Enterprises",
    short_name: "Avepo",
    description:
      "Avepo Enterprises Limited - agro-inputs, animal health, and Smart Farm expertise across Siaya County.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: theme.primary,
    icons: logo.url
      ? [
          { src: logo.url, sizes: "any", type: "image/jpeg" },
          { src: logo.url, sizes: "192x192", type: "image/jpeg" },
          { src: logo.url, sizes: "512x512", type: "image/jpeg" },
        ]
      : [],
  };
}

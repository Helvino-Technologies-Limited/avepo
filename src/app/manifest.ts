import type { MetadataRoute } from "next";
import { getSiteSetting } from "@/lib/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const logo = await getSiteSetting("branding.logo");
  const theme = await getSiteSetting("theme.colors");

  return {
    name: "Avepo Enterprises Limited",
    short_name: "Avepo",
    description:
      "Avepo Enterprises Limited — Our Farms, Our Future. Agro-inputs, animal health, farm consultancy, and Smart Farm expertise for farmers across Kenya.",
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

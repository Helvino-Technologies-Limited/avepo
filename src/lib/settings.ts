import { prisma } from "@/lib/db";

export type ContactSettings = { phone: string; email: string };
export type SocialLinks = {
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
  telegram: string;
};
export type HomepageHero = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  videoUrl: string;
  posterImage: string;
};
export type BrandingLogo = { url: string };
export type ThemeColors = { primary: string; secondary: string; accent: string };
export type FloatingWidgets = {
  whatsapp: boolean;
  call: boolean;
  messenger: boolean;
  backToTop: boolean;
  liveChat: boolean;
};
export type AnalyticsSettings = { gaMeasurementId: string };

const DEFAULTS = {
  "contact.general": { phone: "0722976171", email: "avepoent@gmail.com" } as ContactSettings,
  "social.links": {
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    whatsapp: "",
    telegram: "",
  } as SocialLinks,
  "homepage.hero": {
    headline: "Growing Siaya County, One Farm at a Time",
    subheadline: "Agro-inputs, animal health, and Smart Farm expertise from Avepo Enterprises.",
    ctaLabel: "Explore Products",
    ctaHref: "/products",
    videoUrl: "",
    posterImage: "",
  } as HomepageHero,
  "branding.logo": { url: "" } as BrandingLogo,
  "theme.colors": { primary: "#16a34a", secondary: "#166534", accent: "#f59e0b" } as ThemeColors,
  "widgets.floating": {
    whatsapp: true,
    call: true,
    messenger: false,
    backToTop: true,
    liveChat: false,
  } as FloatingWidgets,
  "analytics.ga": { gaMeasurementId: "" } as AnalyticsSettings,
};

export type SettingKey = keyof typeof DEFAULTS;

export async function getSiteSetting<K extends SettingKey>(
  key: K
): Promise<(typeof DEFAULTS)[K]> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row) return DEFAULTS[key];
  return { ...DEFAULTS[key], ...(row.value as object) } as (typeof DEFAULTS)[K];
}

export async function getAllSiteSettings() {
  const keys = Object.keys(DEFAULTS) as SettingKey[];
  const values = await Promise.all(keys.map((key) => getSiteSetting(key)));
  return Object.fromEntries(keys.map((key, i) => [key, values[i]])) as {
    [K in SettingKey]: (typeof DEFAULTS)[K];
  };
}

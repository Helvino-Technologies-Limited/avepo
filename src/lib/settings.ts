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
export type BrandingLogo = { url: string; secondaryUrl: string };
export type ThemeColors = { primary: string; secondary: string; accent: string; background: string };
export type ThemeTypography = { fontFamily: "sans" | "serif" | "classic"; textColor: string };
export type FloatingWidgets = {
  whatsapp: boolean;
  call: boolean;
  messenger: boolean;
  backToTop: boolean;
  liveChat: boolean;
  whatsappMessage: string;
};
export type AnalyticsSettings = { gaMeasurementId: string };
export type AboutContent = {
  vision: string;
  mission: string;
  coreValues: string;
  whyChooseUs: string;
};

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
    headline: "Welcome to Avepo Enterprises Limited",
    subheadline:
      "Our Farms, Our Future — agro-inputs, animal health, and Smart Farm expertise for farmers across Kenya.",
    ctaLabel: "Explore Products",
    ctaHref: "/products",
    videoUrl: "",
    posterImage: "",
  } as HomepageHero,
  "branding.logo": { url: "", secondaryUrl: "" } as BrandingLogo,
  // Gold, deep navy-teal, teal, and a gold page background — sampled directly
  // from the Avepo logo (src/app/icon.jpg). Admin can always change this from
  // Site Settings.
  "theme.colors": {
    primary: "#EA9E27",
    secondary: "#073C42",
    accent: "#07586B",
    background: "#EA9E27",
  } as ThemeColors,
  "theme.typography": { fontFamily: "sans", textColor: "#171717" } as ThemeTypography,
  "widgets.floating": {
    whatsapp: true,
    call: true,
    messenger: false,
    backToTop: true,
    liveChat: false,
    whatsappMessage: "Hi Avepo, I'd like to know more about your products and services.",
  } as FloatingWidgets,
  "analytics.ga": { gaMeasurementId: "" } as AnalyticsSettings,
  "about.content": {
    vision: "Technology dissemination and affordable farm input access in rural areas.",
    mission: "Agriculture for Livelihood — helping every farmer in Siaya County farm smarter and more profitably.",
    coreValues:
      "We're committed to making modern farming technology and quality agro-inputs accessible and affordable for every farmer in our community.",
    whyChooseUs:
      "With over 15 years of experience serving farmers across Siaya County, Avepo combines genuine agro-input supply, animal health services, and Smart Farm expertise — all from branches close to home.",
  } as AboutContent,
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

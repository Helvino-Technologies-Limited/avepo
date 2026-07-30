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
    headline: "Growing Siaya County, One Farm at a Time",
    subheadline: "Agro-inputs, animal health, and Smart Farm expertise from Avepo Enterprises.",
    ctaLabel: "Explore Products",
    ctaHref: "/products",
  } as HomepageHero,
};

export async function getSiteSetting<K extends keyof typeof DEFAULTS>(
  key: K
): Promise<(typeof DEFAULTS)[K]> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row) return DEFAULTS[key];
  return { ...DEFAULTS[key], ...(row.value as object) } as (typeof DEFAULTS)[K];
}

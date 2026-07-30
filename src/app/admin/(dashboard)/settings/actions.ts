"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

async function upsert(key: string, value: unknown) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: value as never },
    create: { key, value: value as never },
  });
}

export async function updateSiteSettings(formData: FormData) {
  await requireRole("update");

  await upsert("branding.logo", { url: String(formData.get("logoUrl") ?? "") });

  await upsert("theme.colors", {
    primary: String(formData.get("primaryColor") ?? "#16a34a"),
    secondary: String(formData.get("secondaryColor") ?? "#166534"),
    accent: String(formData.get("accentColor") ?? "#f59e0b"),
  });

  await upsert("contact.general", {
    phone: String(formData.get("contactPhone") ?? ""),
    email: String(formData.get("contactEmail") ?? ""),
  });

  await upsert("social.links", {
    facebook: String(formData.get("facebook") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
    linkedin: String(formData.get("linkedin") ?? ""),
    twitter: String(formData.get("twitter") ?? ""),
    youtube: String(formData.get("youtube") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    telegram: String(formData.get("telegram") ?? ""),
  });

  await upsert("widgets.floating", {
    whatsapp: formData.get("widgetWhatsapp") === "on",
    call: formData.get("widgetCall") === "on",
    messenger: formData.get("widgetMessenger") === "on",
    backToTop: formData.get("widgetBackToTop") === "on",
    liveChat: formData.get("widgetLiveChat") === "on",
  });

  await upsert("homepage.hero", {
    headline: String(formData.get("heroHeadline") ?? ""),
    subheadline: String(formData.get("heroSubheadline") ?? ""),
    ctaLabel: String(formData.get("heroCtaLabel") ?? ""),
    ctaHref: String(formData.get("heroCtaHref") ?? ""),
  });

  // Site settings back every public page (header/footer/hero/widgets),
  // so revalidate broadly rather than trying to enumerate every route.
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

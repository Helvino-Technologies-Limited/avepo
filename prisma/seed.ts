import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BRANCHES = [
  {
    name: "Siaya CBD",
    slug: "siaya-cbd",
    phone: "0745248822",
    address: "Siaya CBD, Siaya County",
  },
  {
    name: "Bondo Town",
    slug: "bondo-town",
    phone: "0748167550",
    address: "Bondo Town, Siaya County",
  },
  {
    name: "Ndere Market",
    slug: "ndere-market",
    phone: "0113453111",
    address: "Ndere Market, Siaya County",
  },
  {
    name: "Boro Market",
    slug: "boro-market",
    phone: "0790242857",
    address: "Boro Market, Siaya County",
  },
];

const DEFAULT_SETTINGS: { key: string; value: unknown }[] = [
  {
    key: "contact.general",
    value: { phone: "0722976171", email: "avepoent@gmail.com" },
  },
  {
    key: "social.links",
    value: {
      facebook: "",
      instagram: "",
      tiktok: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      whatsapp: "",
      telegram: "",
    },
  },
  {
    key: "theme.colors",
    value: { primary: "#16a34a", secondary: "#166534", accent: "#f59e0b" },
  },
  {
    key: "widgets.floating",
    value: { whatsapp: true, call: true, messenger: false, backToTop: true, liveChat: false },
  },
  {
    key: "homepage.hero",
    value: {
      headline: "Growing Siaya County, One Farm at a Time",
      subheadline: "Agro-inputs, animal health, and Smart Farm expertise from Avepo Enterprises.",
      ctaLabel: "Explore Products",
      ctaHref: "/products",
    },
  },
];

async function main() {
  for (const [index, branch] of BRANCHES.entries()) {
    await prisma.branch.upsert({
      where: { slug: branch.slug },
      update: { ...branch, order: index },
      create: { ...branch, order: index },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in the environment");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "SUPER_ADMIN", isActive: true },
    create: {
      name: "Avepo Super Admin",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  for (const setting of DEFAULT_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value as never },
      create: { key: setting.key, value: setting.value as never },
    });
  }

  console.log("Seed complete: branches, super admin, and default site settings created.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

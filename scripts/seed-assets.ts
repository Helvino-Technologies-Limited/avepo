import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LOGO_PATH = "/mnt/c/Users/kevob/Downloads/logo.jfif";
const PARTNERS_DIR = "/mnt/c/Users/kevob/Desktop/partners";

function displayName(baseName: string): string {
  if (/^\d+$/.test(baseName)) return `Partner ${baseName}`;
  return baseName.charAt(0).toUpperCase() + baseName.slice(1);
}

async function main() {
  // Logo
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  const logoBlob = await put("branding/logo.jfif", logoBuffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/jpeg",
  });
  await prisma.siteSetting.upsert({
    where: { key: "branding.logo" },
    update: { value: { url: logoBlob.url } },
    create: { key: "branding.logo", value: { url: logoBlob.url } },
  });
  console.log("Logo uploaded:", logoBlob.url);

  // Partners
  const files = fs
    .readdirSync(PARTNERS_DIR)
    .filter((f) => /\.(jfif|jpe?g|png|webp)$/i.test(f))
    .sort();

  let order = 0;
  for (const file of files) {
    const filePath = path.join(PARTNERS_DIR, file);
    const buffer = fs.readFileSync(filePath);
    const baseName = path.parse(file).name;
    const name = displayName(baseName);

    const blob = await put(`partners/${baseName}${path.extname(file)}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/jpeg",
    });

    const existing = await prisma.partner.findFirst({ where: { logo: blob.url } });
    if (!existing) {
      await prisma.partner.create({
        data: { name, logo: blob.url, order: order++ },
      });
    }

    console.log(`Partner uploaded: ${name} -> ${blob.url}`);
  }

  console.log(`Done. ${files.length} partner logos processed.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

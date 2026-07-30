import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PHOTOS_DIR = "/mnt/c/Users/kevob/Desktop/Projects and photos";
const BRANCHES_DIR = "/mnt/c/Users/kevob/Desktop/branches";
const HERO_VIDEO_PATH = "/mnt/c/Users/kevob/Downloads/hero.mp4";

const uploadCache = new Map<string, string>();

async function uploadOnce(absolutePath: string, blobPath: string): Promise<string> {
  if (uploadCache.has(absolutePath)) return uploadCache.get(absolutePath)!;
  const buffer = fs.readFileSync(absolutePath);
  const blob = await put(blobPath, buffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/jpeg",
  });
  uploadCache.set(absolutePath, blob.url);
  console.log(`uploaded ${path.basename(absolutePath)} -> ${blob.url}`);
  return blob.url;
}

function photo(filename: string): string {
  return path.join(PHOTOS_DIR, filename);
}

async function seedHero() {
  const videoBuffer = fs.readFileSync(HERO_VIDEO_PATH);
  const videoBlob = await put("hero/hero.mp4", videoBuffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: "video/mp4",
  });
  const posterUrl = await uploadOnce(photo("farming.jfif"), "content/farming.jfif");

  const existing = await prisma.siteSetting.findUnique({ where: { key: "homepage.hero" } });
  const currentValue = (existing?.value as Record<string, unknown>) ?? {};

  await prisma.siteSetting.upsert({
    where: { key: "homepage.hero" },
    update: { value: { ...currentValue, videoUrl: videoBlob.url, posterImage: posterUrl } },
    create: {
      key: "homepage.hero",
      value: {
        headline: "Growing Siaya County, One Farm at a Time",
        subheadline: "Agro-inputs, animal health, and Smart Farm expertise from Avepo Enterprises.",
        ctaLabel: "Explore Products",
        ctaHref: "/products",
        videoUrl: videoBlob.url,
        posterImage: posterUrl,
      },
    },
  });
  console.log("Hero video + poster set.");
}

type BranchSeed = {
  slug: string;
  name: string;
  photoFile: string;
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
};

const BRANCH_PHOTOS: BranchSeed[] = [
  { slug: "siaya-cbd", name: "Siaya CBD", photoFile: "Siaya Headquarter.jfif", lat: -0.0607, lng: 34.2881 },
  { slug: "bondo-town", name: "Bondo Town", photoFile: "Bondo.jfif", lat: -0.2405, lng: 34.2823 },
  { slug: "boro-market", name: "Boro Market", photoFile: "Boro.jfif", lat: -0.05, lng: 34.33 },
  {
    slug: "ugunja",
    name: "Ugunja",
    photoFile: "ugunja.jfif",
    lat: 0.0667,
    lng: 34.2833,
    address: "Ugunja, Siaya County",
  },
  {
    slug: "yala",
    name: "Yala",
    photoFile: "yala.jfif",
    lat: 0.0672,
    lng: 34.4642,
    address: "Yala, Siaya County",
  },
];

async function seedBranches() {
  for (const [index, b] of BRANCH_PHOTOS.entries()) {
    const photoUrl = await uploadOnce(
      path.join(BRANCHES_DIR, b.photoFile),
      `branches/${b.slug}${path.extname(b.photoFile)}`
    );

    await prisma.branch.upsert({
      where: { slug: b.slug },
      update: { photo: photoUrl, lat: b.lat, lng: b.lng },
      create: {
        name: b.name,
        slug: b.slug,
        photo: photoUrl,
        lat: b.lat,
        lng: b.lng,
        address: b.address,
        order: 100 + index, // after the original phase-1 branches
      },
    });
  }

  // Ndere Market has no dedicated photo file but already exists from phase 1 —
  // just give it approximate coordinates.
  await prisma.branch
    .update({
      where: { slug: "ndere-market" },
      data: { lat: -0.1206, lng: 34.3667 },
    })
    .catch(() => {});

  console.log("Branches seeded (incl. Ugunja, Yala) with photos + coordinates.");
}

const GALLERY_MAP: Record<string, string[]> = {
  EVENTS: [
    "1.jfif",
    "2.jfif",
    "3.jfif",
    "Education team.jfif",
    "Events.jfif",
    "advert.jfif",
    "avepo team.jfif",
    "baord team.jfif",
    "board.jfif",
    "certificates.jfif",
    "employees.jfif",
    "empowerment.jfif",
    "event.jfif",
    "event1.jfif",
    "holyday.jfif",
    "meetings.jfif",
    "organise.jfif",
    "recognition.jfif",
    "sales.jfif",
    "sales2.jfif",
    "show.jfif",
    "show2.jfif",
    "students.jfif",
    "talk.jfif",
    "teach.jfif",
    "uniform.jfif",
    "w.jfif",
  ],
  SMART_FARM: [
    "Agriculture.jfif",
    "animals.jfif",
    "birds.jfif",
    "ecog.jfif",
    "farm overview.jfif",
    "farming and camping.jfif",
    "farming.jfif",
    "green.jfif",
    "greenhouse.jfif",
    "maize crop.jfif",
    "seedlings.jfif",
    "vac.jfif",
    "vaccination.jfif",
    "wheat crop.jfif",
  ],
  PRODUCTS: ["agric products.jfif", "harvest1.jfif", "harvesting.jfif", "produce farm.jfif", "produce2.jfif", "seeds.jfif"],
  BRANCHES: ["avepo building in Siaya.jfif", "avepo.jfif", "office.jfif", "moto photo.jfif", "transportation.jfif"],
  FARMERS: ["customer.jfif", "famers.jfif", "farmers.jfif", "training.jfif", "training2.jfif"],
};

const ALBUM_TITLES: Record<string, string> = {
  EVENTS: "Company Events",
  SMART_FARM: "Smart Farm Activities",
  PRODUCTS: "Products in the Field",
  BRANCHES: "Our Branches",
  FARMERS: "Farmers We Serve",
};

async function seedGallery() {
  for (const [type, files] of Object.entries(GALLERY_MAP)) {
    const album = await prisma.galleryAlbum.upsert({
      where: { id: `seed-${type.toLowerCase()}` },
      update: {},
      create: {
        id: `seed-${type.toLowerCase()}`,
        title: ALBUM_TITLES[type],
        type: type as never,
      },
    });

    for (const [i, file] of files.entries()) {
      const url = await uploadOnce(photo(file), `content/${file}`);
      const alreadyExists = await prisma.galleryMedia.findFirst({ where: { albumId: album.id, url } });
      if (!alreadyExists) {
        await prisma.galleryMedia.create({
          data: { albumId: album.id, url, type: "IMAGE", order: i },
        });
      }
    }
    console.log(`Gallery album "${ALBUM_TITLES[type]}" seeded with ${files.length} photos.`);
  }
}

const SERVICES: { title: string; photoFile: string }[] = [
  { title: "Agro-input Distribution", photoFile: "agric products.jfif" },
  { title: "Farm Consultancy", photoFile: "teach.jfif" },
  { title: "Soil Testing", photoFile: "farm overview.jfif" },
  { title: "Greenhouse Consultancy", photoFile: "greenhouse.jfif" },
  { title: "Smart Farm Demonstrations", photoFile: "Agriculture.jfif" },
  { title: "Dairy Services", photoFile: "animals.jfif" },
  { title: "Animal Health / Clinical Services", photoFile: "vaccination.jfif" },
  { title: "Artificial Insemination", photoFile: "animals.jfif" },
  { title: "Farmer Training", photoFile: "training.jfif" },
  { title: "Farm Visits", photoFile: "farming.jfif" },
  { title: "Agricultural Exhibitions", photoFile: "show.jfif" },
  { title: "Field Days", photoFile: "event.jfif" },
  { title: "Internships", photoFile: "students.jfif" },
  { title: "Attachments", photoFile: "students.jfif" },
  { title: "Agricultural Mentorship", photoFile: "teach.jfif" },
  { title: "Pet Grooming", photoFile: "animals.jfif" },
  { title: "Pet Training", photoFile: "animals.jfif" },
  { title: "Agricultural Extension Services", photoFile: "farming.jfif" },
  { title: "Market Linkage", photoFile: "sales.jfif" },
  { title: "Spray Services", photoFile: "green.jfif" },
  { title: "Farm Workshops", photoFile: "training2.jfif" },
  { title: "Farm Business Quotations", photoFile: "sales2.jfif" },
  { title: "Transportation Services", photoFile: "transportation.jfif" },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seedServices() {
  for (const [index, s] of SERVICES.entries()) {
    const url = await uploadOnce(photo(s.photoFile), `content/${s.photoFile}`);
    const slug = slugify(s.title);

    await prisma.service.upsert({
      where: { slug },
      update: { image: url },
      create: { title: s.title, slug, image: url, order: index },
    });
  }
  console.log(`${SERVICES.length} services seeded with photos.`);
}

const PRODUCT_CATEGORIES = [
  "Crop Health",
  "Fertilizers",
  "Seeds",
  "Herbicides",
  "Fungicides",
  "Insecticides",
  "Foliar Fertilizers",
  "Soil Conditioners",
  "Farm Tools",
  "Veterinary",
  "Animal Feeds",
  "Vaccines",
  "Dewormers",
  "Injectables",
  "Acaricides",
  "Mineral Salts",
  "Poultry Products",
  "Equipment",
];

async function seedProductCategories() {
  for (const [index, name] of PRODUCT_CATEGORIES.entries()) {
    const slug = slugify(name);
    await prisma.productCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug, order: index },
    });
  }
  console.log(`${PRODUCT_CATEGORIES.length} product categories seeded.`);
}

async function main() {
  await seedHero();
  await seedBranches();
  await seedGallery();
  await seedServices();
  await seedProductCategories();
  console.log("Phase 3 asset seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { slugify } from "@/lib/slug";
import { deleteBlob } from "@/lib/blob";

const CATEGORIES = [
  "CROP_PRODUCTION",
  "LIVESTOCK",
  "POULTRY",
  "SOIL_HEALTH",
  "FERTILIZERS",
  "PEST_MANAGEMENT",
  "DISEASE_MANAGEMENT",
  "CLIMATE_SMART_AGRICULTURE",
  "AI_IN_FARMING",
] as const;

const schema = z.object({
  title: z.string().min(1),
  category: z.enum(CATEGORIES),
  body: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  pdfUrl: z.string().optional().or(z.literal("")),
  videoUrl: z.string().optional().or(z.literal("")),
  isPublished: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    category: formData.get("category"),
    body: formData.get("body") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    pdfUrl: formData.get("pdfUrl") ?? "",
    videoUrl: formData.get("videoUrl") ?? "",
    isPublished: formData.get("isPublished") ?? undefined,
  });
}

export async function createArticle(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.knowledgeArticle.create({
    data: {
      title: data.title,
      slug: `${slugify(data.title)}-${Math.random().toString(36).slice(2, 7)}`,
      category: data.category,
      body: data.body || null,
      coverImage: data.coverImage || null,
      pdfUrl: data.pdfUrl || null,
      videoUrl: data.videoUrl || null,
      isPublished: data.isPublished === "on",
    },
  });

  revalidatePath("/admin/knowledge-centre");
  revalidatePath("/knowledge-centre");
  redirect("/admin/knowledge-centre?saved=1");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.knowledgeArticle.update({
    where: { id },
    data: {
      title: data.title,
      category: data.category,
      body: data.body || null,
      coverImage: data.coverImage || null,
      pdfUrl: data.pdfUrl || null,
      videoUrl: data.videoUrl || null,
      isPublished: data.isPublished === "on",
    },
  });

  revalidatePath("/admin/knowledge-centre");
  revalidatePath("/knowledge-centre");
  redirect("/admin/knowledge-centre?saved=1");
}

export async function deleteArticle(id: string) {
  await requireRole("delete");
  const article = await prisma.knowledgeArticle.findUnique({ where: { id } });
  if (article?.coverImage) await deleteBlob(article.coverImage);
  await prisma.knowledgeArticle.delete({ where: { id } });
  revalidatePath("/admin/knowledge-centre");
  revalidatePath("/knowledge-centre");
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { slugify } from "@/lib/slug";
import { deleteBlob } from "@/lib/blob";

const schema = z.object({
  title: z.string().min(1),
  category: z.string().optional().or(z.literal("")),
  body: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  media: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishAt: z.string().optional().or(z.literal("")),
  isFeatured: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    category: formData.get("category") ?? "",
    body: formData.get("body") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    media: formData.getAll("media").map(String),
    status: formData.get("status"),
    publishAt: formData.get("publishAt") ?? "",
    isFeatured: formData.get("isFeatured") ?? undefined,
  });
}

export async function createNewsPost(formData: FormData) {
  const session = await requireRole("create");
  const data = parse(formData);

  await prisma.newsPost.create({
    data: {
      title: data.title,
      slug: `${slugify(data.title)}-${Math.random().toString(36).slice(2, 7)}`,
      category: data.category || null,
      body: data.body || null,
      coverImage: data.coverImage || null,
      media: data.media ?? [],
      status: data.status,
      publishAt: data.publishAt ? new Date(data.publishAt) : data.status === "PUBLISHED" ? new Date() : null,
      isFeatured: data.isFeatured === "on",
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function updateNewsPost(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.newsPost.update({
    where: { id },
    data: {
      title: data.title,
      category: data.category || null,
      body: data.body || null,
      coverImage: data.coverImage || null,
      media: data.media ?? [],
      status: data.status,
      publishAt: data.publishAt ? new Date(data.publishAt) : data.status === "PUBLISHED" ? new Date() : null,
      isFeatured: data.isFeatured === "on",
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function deleteNewsPost(id: string) {
  await requireRole("delete");
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (post) {
    const urls = [post.coverImage, ...post.media].filter((u): u is string => !!u);
    await Promise.all(urls.map((u) => deleteBlob(u)));
  }
  await prisma.newsPost.delete({ where: { id } });
  revalidatePath("/admin/news");
  revalidatePath("/news");
}

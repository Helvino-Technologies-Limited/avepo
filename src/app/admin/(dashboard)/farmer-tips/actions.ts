"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { slugify } from "@/lib/slug";
import { deleteBlob } from "@/lib/blob";
import { notifySubscribers } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

const schema = z.object({
  title: z.string().min(1),
  category: z.string().optional().or(z.literal("")),
  body: z.string().min(1),
  images: z.array(z.string()).optional(),
  videoUrl: z.string().optional().or(z.literal("")),
  isFeatured: z.string().optional(),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    category: formData.get("category") ?? "",
    body: formData.get("body"),
    images: formData.getAll("images").map(String),
    videoUrl: formData.get("videoUrl") ?? "",
    isFeatured: formData.get("isFeatured") ?? undefined,
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createFarmerTip(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  const tip = await prisma.farmerTip.create({
    data: {
      title: data.title,
      slug: `${slugify(data.title)}-${Math.random().toString(36).slice(2, 7)}`,
      category: data.category || null,
      body: data.body,
      images: data.images ?? [],
      videoUrl: data.videoUrl || null,
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  if (tip.isActive) {
    await notifySubscribers(
      `New Farmer Tip: ${tip.title}`,
      `<p>${tip.category ? `<strong>${tip.category}</strong><br/>` : ""}${tip.body.slice(
        0,
        300
      )}</p><p><a href="${SITE_URL}/farmer-tips/${tip.slug}">Read More</a></p>`
    );
  }

  revalidatePath("/admin/farmer-tips");
  revalidatePath("/farmer-tips");
  redirect("/admin/farmer-tips?saved=1");
}

export async function updateFarmerTip(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.farmerTip.update({
    where: { id },
    data: {
      title: data.title,
      category: data.category || null,
      body: data.body,
      images: data.images ?? [],
      videoUrl: data.videoUrl || null,
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/farmer-tips");
  revalidatePath("/farmer-tips");
  redirect("/admin/farmer-tips?saved=1");
}

export async function deleteFarmerTip(id: string) {
  await requireRole("delete");
  const tip = await prisma.farmerTip.findUnique({ where: { id } });
  if (tip) await Promise.all(tip.images.map((u) => deleteBlob(u)));
  await prisma.farmerTip.delete({ where: { id } });
  revalidatePath("/admin/farmer-tips");
  revalidatePath("/farmer-tips");
}

export async function toggleFarmerTipActive(id: string, isActive: boolean) {
  await requireRole("update");
  await prisma.farmerTip.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/farmer-tips");
  revalidatePath("/farmer-tips");
}

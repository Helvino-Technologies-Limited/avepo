"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { deleteBlob } from "@/lib/blob";

const schema = z.object({
  title: z.string().min(1),
  type: z.enum(["DEMO_FARM", "GREENHOUSE", "DAIRY", "POULTRY"]),
  description: z.string().optional().or(z.literal("")),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description") ?? "",
    images: formData.getAll("images").map(String),
    videos: String(formData.get("videos") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createSmartFarmSection(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.smartFarmSection.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description || null,
      images: data.images ?? [],
      videos: data.videos ?? [],
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/smart-farm");
  revalidatePath("/smart-farm");
  redirect("/admin/smart-farm");
}

export async function updateSmartFarmSection(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.smartFarmSection.update({
    where: { id },
    data: {
      title: data.title,
      type: data.type,
      description: data.description || null,
      images: data.images ?? [],
      videos: data.videos ?? [],
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/smart-farm");
  revalidatePath("/smart-farm");
  redirect("/admin/smart-farm");
}

export async function deleteSmartFarmSection(id: string) {
  await requireRole("delete");
  const section = await prisma.smartFarmSection.findUnique({ where: { id } });
  if (section) await Promise.all(section.images.map((u) => deleteBlob(u)));
  await prisma.smartFarmSection.delete({ where: { id } });
  revalidatePath("/admin/smart-farm");
  revalidatePath("/smart-farm");
}

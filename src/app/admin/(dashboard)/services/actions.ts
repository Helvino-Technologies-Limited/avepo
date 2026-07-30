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
  description: z.string().optional().or(z.literal("")),
  icon: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  isFeatured: z.string().optional(),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    icon: formData.get("icon") ?? "",
    image: formData.get("image") ?? "",
    isFeatured: formData.get("isFeatured") ?? undefined,
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createService(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.service.create({
    data: {
      title: data.title,
      slug: `${slugify(data.title)}-${Math.random().toString(36).slice(2, 7)}`,
      description: data.description || null,
      icon: data.icon || null,
      image: data.image || null,
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.service.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      icon: data.icon || null,
      image: data.image || null,
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireRole("delete");
  const service = await prisma.service.findUnique({ where: { id } });
  if (service?.image) await deleteBlob(service.image);
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await requireRole("update");
  await prisma.service.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

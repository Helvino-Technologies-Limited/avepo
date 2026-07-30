"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { slugify } from "@/lib/slug";

const schema = z.object({
  name: z.string().min(1),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  hours: z.string().optional().or(z.literal("")),
  lat: z.string().optional().or(z.literal("")),
  lng: z.string().optional().or(z.literal("")),
  photo: z.string().optional().or(z.literal("")),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    name: formData.get("name"),
    address: formData.get("address") ?? "",
    phone: formData.get("phone") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    email: formData.get("email") ?? "",
    hours: formData.get("hours") ?? "",
    lat: formData.get("lat") ?? "",
    lng: formData.get("lng") ?? "",
    photo: formData.get("photo") ?? "",
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createBranch(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.branch.create({
    data: {
      name: data.name,
      slug: `${slugify(data.name)}-${Math.random().toString(36).slice(2, 7)}`,
      address: data.address || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      hours: data.hours || null,
      lat: data.lat ? Number(data.lat) : null,
      lng: data.lng ? Number(data.lng) : null,
      photo: data.photo || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/branches");
  revalidatePath("/contact");
  revalidatePath("/");
  redirect("/admin/branches");
}

export async function updateBranch(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.branch.update({
    where: { id },
    data: {
      name: data.name,
      address: data.address || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      hours: data.hours || null,
      lat: data.lat ? Number(data.lat) : null,
      lng: data.lng ? Number(data.lng) : null,
      photo: data.photo || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/branches");
  revalidatePath("/contact");
  revalidatePath("/");
  redirect("/admin/branches");
}

export async function deleteBranch(id: string) {
  await requireRole("delete");
  await prisma.branch.delete({ where: { id } });
  revalidatePath("/admin/branches");
  revalidatePath("/contact");
  revalidatePath("/");
}

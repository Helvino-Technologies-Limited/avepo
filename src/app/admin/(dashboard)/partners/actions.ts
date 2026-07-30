"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { deleteBlob } from "@/lib/blob";

const schema = z.object({
  name: z.string().min(1),
  logo: z.string().min(1, "Please upload a logo."),
  website: z.string().optional().or(z.literal("")),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    name: formData.get("name"),
    logo: formData.get("logo"),
    website: formData.get("website") ?? "",
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createPartner(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.partner.create({
    data: {
      name: data.name,
      logo: data.logo,
      website: data.website || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/partners");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/partners");
}

export async function updatePartner(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.partner.update({
    where: { id },
    data: {
      name: data.name,
      logo: data.logo,
      website: data.website || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/partners");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/partners");
}

export async function deletePartner(id: string) {
  await requireRole("delete");
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (partner?.logo) await deleteBlob(partner.logo);
  await prisma.partner.delete({ where: { id } });
  revalidatePath("/admin/partners");
  revalidatePath("/");
  revalidatePath("/about");
}

export async function togglePartnerActive(id: string, isActive: boolean) {
  await requireRole("update");
  await prisma.partner.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/partners");
  revalidatePath("/");
  revalidatePath("/about");
}

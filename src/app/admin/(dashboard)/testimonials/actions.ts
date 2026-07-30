"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { deleteBlob } from "@/lib/blob";

const schema = z.object({
  name: z.string().min(1),
  role: z.string().optional().or(z.literal("")),
  photo: z.string().optional().or(z.literal("")),
  quote: z.string().min(1),
  rating: z.string().optional().or(z.literal("")),
  isFeatured: z.string().optional(),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    name: formData.get("name"),
    role: formData.get("role") ?? "",
    photo: formData.get("photo") ?? "",
    quote: formData.get("quote"),
    rating: formData.get("rating") ?? "",
    isFeatured: formData.get("isFeatured") ?? undefined,
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createTestimonial(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.testimonial.create({
    data: {
      name: data.name,
      role: data.role || null,
      photo: data.photo || null,
      quote: data.quote,
      rating: data.rating ? Number(data.rating) : null,
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.testimonial.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role || null,
      photo: data.photo || null,
      quote: data.quote,
      rating: data.rating ? Number(data.rating) : null,
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireRole("delete");
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (t?.photo) await deleteBlob(t.photo);
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}

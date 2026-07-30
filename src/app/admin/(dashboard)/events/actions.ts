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
  venue: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  coverImage: z.string().optional().or(z.literal("")),
  gallery: z.array(z.string()).optional(),
  videoUrl: z.string().optional().or(z.literal("")),
  registrationLink: z.string().optional().or(z.literal("")),
  organizer: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    venue: formData.get("venue") ?? "",
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    coverImage: formData.get("coverImage") ?? "",
    gallery: formData.getAll("gallery").map(String),
    videoUrl: formData.get("videoUrl") ?? "",
    registrationLink: formData.get("registrationLink") ?? "",
    organizer: formData.get("organizer") ?? "",
    category: formData.get("category") ?? "",
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createEvent(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.event.create({
    data: {
      title: data.title,
      slug: `${slugify(data.title)}-${Math.random().toString(36).slice(2, 7)}`,
      description: data.description || null,
      venue: data.venue || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      coverImage: data.coverImage || null,
      gallery: data.gallery ?? [],
      videoUrl: data.videoUrl || null,
      registrationLink: data.registrationLink || null,
      organizer: data.organizer || null,
      category: data.category || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      venue: data.venue || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      coverImage: data.coverImage || null,
      gallery: data.gallery ?? [],
      videoUrl: data.videoUrl || null,
      registrationLink: data.registrationLink || null,
      organizer: data.organizer || null,
      category: data.category || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireRole("delete");
  const event = await prisma.event.findUnique({ where: { id } });
  if (event) {
    const urls = [event.coverImage, ...event.gallery].filter((u): u is string => !!u);
    await Promise.all(urls.map((u) => deleteBlob(u)));
  }
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function toggleEventActive(id: string, isActive: boolean) {
  await requireRole("update");
  await prisma.event.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

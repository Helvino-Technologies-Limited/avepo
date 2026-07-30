"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { deleteBlob } from "@/lib/blob";

const albumSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["EVENTS", "PRODUCTS", "SMART_FARM", "BRANCHES", "FARMERS"]),
  coverImage: z.string().optional().or(z.literal("")),
});

export async function createAlbum(formData: FormData) {
  await requireRole("create");
  const data = albumSchema.parse({
    title: formData.get("title"),
    type: formData.get("type"),
    coverImage: formData.get("coverImage") ?? "",
  });

  const album = await prisma.galleryAlbum.create({
    data: { title: data.title, type: data.type, coverImage: data.coverImage || null },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect(`/admin/gallery/${album.id}?saved=1`);
}

export async function updateAlbum(id: string, formData: FormData) {
  await requireRole("update");
  const data = albumSchema.parse({
    title: formData.get("title"),
    type: formData.get("type"),
    coverImage: formData.get("coverImage") ?? "",
  });

  await prisma.galleryAlbum.update({
    where: { id },
    data: { title: data.title, type: data.type, coverImage: data.coverImage || null },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect(`/admin/gallery/${id}?saved=1`);
}

export async function deleteAlbum(id: string) {
  await requireRole("delete");
  const album = await prisma.galleryAlbum.findUnique({ where: { id }, include: { media: true } });
  if (album) {
    const urls = [album.coverImage, ...album.media.map((m) => m.url)].filter(
      (u): u is string => !!u
    );
    await Promise.all(urls.map((u) => deleteBlob(u)));
  }
  await prisma.galleryAlbum.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function addMedia(albumId: string, formData: FormData) {
  await requireRole("create");
  const type = String(formData.get("type") ?? "IMAGE") as "IMAGE" | "VIDEO";
  const caption = String(formData.get("caption") ?? "");

  const urls =
    type === "IMAGE"
      ? formData.getAll("urls").map(String).filter(Boolean)
      : [String(formData.get("url") ?? "")].filter(Boolean);

  if (urls.length === 0) return;

  await prisma.galleryMedia.createMany({
    data: urls.map((url) => ({ albumId, url, type, caption: caption || null })),
  });

  revalidatePath(`/admin/gallery/${albumId}`);
  revalidatePath("/gallery");
}

export async function deleteMedia(albumId: string, mediaId: string) {
  await requireRole("delete");
  const media = await prisma.galleryMedia.findUnique({ where: { id: mediaId } });
  if (media?.type === "IMAGE") await deleteBlob(media.url);
  await prisma.galleryMedia.delete({ where: { id: mediaId } });
  revalidatePath(`/admin/gallery/${albumId}`);
  revalidatePath("/gallery");
}

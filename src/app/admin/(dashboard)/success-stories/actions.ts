"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { deleteBlob } from "@/lib/blob";

const schema = z.object({
  title: z.string().min(1),
  farmerName: z.string().min(1),
  beforeImage: z.string().optional().or(z.literal("")),
  afterImage: z.string().optional().or(z.literal("")),
  video: z.string().optional().or(z.literal("")),
  body: z.string().optional().or(z.literal("")),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    farmerName: formData.get("farmerName"),
    beforeImage: formData.get("beforeImage") ?? "",
    afterImage: formData.get("afterImage") ?? "",
    video: formData.get("video") ?? "",
    body: formData.get("body") ?? "",
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createSuccessStory(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.successStory.create({
    data: {
      title: data.title,
      farmerName: data.farmerName,
      beforeImage: data.beforeImage || null,
      afterImage: data.afterImage || null,
      video: data.video || null,
      body: data.body || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/success-stories");
  redirect("/admin/success-stories?saved=1");
}

export async function updateSuccessStory(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.successStory.update({
    where: { id },
    data: {
      title: data.title,
      farmerName: data.farmerName,
      beforeImage: data.beforeImage || null,
      afterImage: data.afterImage || null,
      video: data.video || null,
      body: data.body || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/success-stories");
  redirect("/admin/success-stories?saved=1");
}

export async function deleteSuccessStory(id: string) {
  await requireRole("delete");
  const story = await prisma.successStory.findUnique({ where: { id } });
  const urls = [story?.beforeImage, story?.afterImage].filter((u): u is string => !!u);
  await Promise.all(urls.map((u) => deleteBlob(u)));
  await prisma.successStory.delete({ where: { id } });
  revalidatePath("/admin/success-stories");
}

export async function toggleSuccessStoryActive(id: string, isActive: boolean) {
  await requireRole("update");
  await prisma.successStory.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/success-stories");
}

const publicSchema = z.object({
  title: z.string().min(1).max(150),
  farmerName: z.string().min(1).max(100),
  body: z.string().max(2000).optional().or(z.literal("")),
  beforeImage: z.string().optional().or(z.literal("")),
  afterImage: z.string().optional().or(z.literal("")),
  video: z.string().optional().or(z.literal("")),
});

export type SubmitSuccessStoryState = { success: boolean; error?: string };

export async function submitSuccessStory(
  _prev: SubmitSuccessStoryState,
  formData: FormData
): Promise<SubmitSuccessStoryState> {
  const parsed = publicSchema.safeParse({
    title: formData.get("title"),
    farmerName: formData.get("farmerName"),
    body: formData.get("body") ?? "",
    beforeImage: formData.get("beforeImage") ?? "",
    afterImage: formData.get("afterImage") ?? "",
    video: formData.get("video") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: "Please fill in a title and your name." };
  }

  await prisma.successStory.create({
    data: {
      title: parsed.data.title,
      farmerName: parsed.data.farmerName,
      body: parsed.data.body || null,
      beforeImage: parsed.data.beforeImage || null,
      afterImage: parsed.data.afterImage || null,
      video: parsed.data.video || null,
      isActive: false,
    },
  });

  revalidatePath("/admin/success-stories");
  return { success: true };
}

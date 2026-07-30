"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { deleteBlob } from "@/lib/blob";

const schema = z.object({
  title: z.string().min(1),
  category: z.string().optional().or(z.literal("")),
  fileUrl: z.string().min(1, "Please upload a file."),
  fileType: z.string().optional().or(z.literal("")),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    category: formData.get("category") ?? "",
    fileUrl: formData.get("fileUrl"),
    fileType: formData.get("fileType") ?? "",
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createDownload(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.download.create({
    data: {
      title: data.title,
      category: data.category || null,
      fileUrl: data.fileUrl,
      fileType: data.fileType || "PDF",
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/downloads");
  redirect("/admin/downloads");
}

export async function deleteDownload(id: string) {
  await requireRole("delete");
  const download = await prisma.download.findUnique({ where: { id } });
  if (download?.fileUrl) await deleteBlob(download.fileUrl);
  await prisma.download.delete({ where: { id } });
  revalidatePath("/admin/downloads");
}

export async function toggleDownloadActive(id: string, isActive: boolean) {
  await requireRole("update");
  await prisma.download.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/downloads");
}

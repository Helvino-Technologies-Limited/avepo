"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

const schema = z.object({
  title: z.string().min(1),
  type: z.enum(["JOB", "INTERNSHIP", "ATTACHMENT"]),
  description: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
  isActive: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description") ?? "",
    location: formData.get("location") ?? "",
    deadline: formData.get("deadline") ?? "",
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createJob(formData: FormData) {
  await requireRole("create");
  const data = parse(formData);

  await prisma.jobPosting.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description || null,
      location: data.location || null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect("/admin/careers?saved=1");
}

export async function updateJob(id: string, formData: FormData) {
  await requireRole("update");
  const data = parse(formData);

  await prisma.jobPosting.update({
    where: { id },
    data: {
      title: data.title,
      type: data.type,
      description: data.description || null,
      location: data.location || null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect("/admin/careers?saved=1");
}

export async function deleteJob(id: string) {
  await requireRole("delete");
  await prisma.jobPosting.delete({ where: { id } });
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
}

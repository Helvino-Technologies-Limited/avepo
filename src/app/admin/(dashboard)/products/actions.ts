"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { slugify } from "@/lib/slug";
import { deleteBlob } from "@/lib/blob";
import { notifySubscribers } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

const productSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  price: z.string().optional().or(z.literal("")),
  manufacturer: z.string().optional().or(z.literal("")),
  usageInstructions: z.string().optional().or(z.literal("")),
  brochureUrl: z.string().optional().or(z.literal("")),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]),
  images: z.array(z.string()).optional(),
  isFeatured: z.string().optional(),
  isActive: z.string().optional(),
});

function parseProductForm(formData: FormData) {
  return productSchema.parse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId") ?? "",
    description: formData.get("description") ?? "",
    price: formData.get("price") ?? "",
    manufacturer: formData.get("manufacturer") ?? "",
    usageInstructions: formData.get("usageInstructions") ?? "",
    brochureUrl: formData.get("brochureUrl") ?? "",
    stockStatus: formData.get("stockStatus"),
    images: formData.getAll("images").map(String),
    isFeatured: formData.get("isFeatured") ?? undefined,
    isActive: formData.get("isActive") ?? undefined,
  });
}

export async function createProduct(formData: FormData) {
  await requireRole("create");
  const data = parseProductForm(formData);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: `${slugify(data.name)}-${Math.random().toString(36).slice(2, 7)}`,
      categoryId: data.categoryId || null,
      description: data.description || null,
      price: data.price ? data.price : null,
      manufacturer: data.manufacturer || null,
      usageInstructions: data.usageInstructions || null,
      brochureUrl: data.brochureUrl || null,
      stockStatus: data.stockStatus,
      images: data.images ?? [],
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  if (product.isActive) {
    await notifySubscribers(
      `New Product: ${product.name}`,
      `<p>${product.description?.slice(0, 300) ?? ""}</p><p><a href="${SITE_URL}/products/${product.slug}">View Product</a></p>`
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products?saved=1");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireRole("update");
  const data = parseProductForm(formData);

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      categoryId: data.categoryId || null,
      description: data.description || null,
      price: data.price ? data.price : null,
      manufacturer: data.manufacturer || null,
      usageInstructions: data.usageInstructions || null,
      brochureUrl: data.brochureUrl || null,
      stockStatus: data.stockStatus,
      images: data.images ?? [],
      isFeatured: data.isFeatured === "on",
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(id: string) {
  await requireRole("delete");
  const product = await prisma.product.findUnique({ where: { id } });
  if (product) {
    await Promise.all(product.images.map((url) => deleteBlob(url)));
  }
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await requireRole("update");
  await prisma.product.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function createCategory(formData: FormData) {
  await requireRole("create");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.productCategory.create({
    data: { name, slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}` },
  });
  revalidatePath("/admin/products");
}

export async function deleteCategory(id: string) {
  await requireRole("delete");
  await prisma.productCategory.update({ where: { id }, data: { parentId: null } }).catch(() => {});
  await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.productCategory.delete({ where: { id } });
  revalidatePath("/admin/products");
}

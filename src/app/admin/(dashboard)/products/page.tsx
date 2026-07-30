import Link from "next/link";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton, ToggleButton } from "@/components/admin/row-actions";
import { TextInput, SubmitButton } from "@/components/admin/ui";
import {
  deleteProduct,
  toggleProductActive,
  createCategory,
  deleteCategory,
} from "./actions";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.productCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-neutral-900">Categories</h2>
        <form action={createCategory} className="mt-2 flex gap-2">
          <TextInput name="name" placeholder="New category name" required />
          <SubmitButton>Add</SubmitButton>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
            >
              {c.name}
              <form action={deleteCategory.bind(null, c.id)}>
                <button className="text-red-500">×</button>
              </form>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          rows={products}
          emptyMessage="No products yet. Add your first product above."
          editHref={(p) => `/admin/products/${p.id}`}
          columns={[
            { header: "Name", render: (p) => p.name },
            { header: "Category", render: (p) => p.category?.name ?? "—" },
            { header: "Stock", render: (p) => p.stockStatus.replaceAll("_", " ") },
            { header: "Featured", render: (p) => (p.isFeatured ? "Yes" : "No") },
            { header: "Active", render: (p) => (p.isActive ? "Yes" : "No") },
          ]}
          rowActions={(p) => (
            <>
              <ToggleButton
                isActive={p.isActive}
                action={toggleProductActive.bind(null, p.id, p.isActive)}
              />{" "}
              <DeleteButton action={deleteProduct.bind(null, p.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}

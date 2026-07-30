import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "../product-form";
import { updateProduct } from "../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Product</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm action={updateProduct.bind(null, id)} product={product} />
      </div>
    </div>
  );
}

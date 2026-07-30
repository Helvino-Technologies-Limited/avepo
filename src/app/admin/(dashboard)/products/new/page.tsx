import { ProductForm } from "../product-form";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Product</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}

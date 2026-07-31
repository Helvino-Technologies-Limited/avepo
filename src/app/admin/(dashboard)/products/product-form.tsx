import { prisma } from "@/lib/db";
import { Field, TextInput, TextArea, Select, Checkbox, SubmitButton } from "@/components/admin/ui";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { FileUpload } from "@/components/admin/file-upload";
import type { Product } from "@prisma/client";
import { UploadPendingProvider } from "@/components/upload-pending-context";

export async function ProductForm({
  action,
  product,
}: {
  action: (formData: FormData) => Promise<void>;
  product?: Product;
}) {
  const categories = await prisma.productCategory.findMany({ orderBy: { order: "asc" } });

  return (
    <UploadPendingProvider>
        <form action={action} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <TextInput id="name" name="name" required defaultValue={product?.name} />
      </Field>

      <Field label="Category" htmlFor="categoryId">
        <Select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? ""}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={product?.description ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (KES, optional)" htmlFor="price">
          <TextInput
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price?.toString() ?? ""}
          />
        </Field>
        <Field label="Manufacturer" htmlFor="manufacturer">
          <TextInput id="manufacturer" name="manufacturer" defaultValue={product?.manufacturer ?? ""} />
        </Field>
      </div>

      <Field label="Usage Instructions" htmlFor="usageInstructions">
        <TextArea
          id="usageInstructions"
          name="usageInstructions"
          defaultValue={product?.usageInstructions ?? ""}
        />
      </Field>

      <Field label="Stock Status" htmlFor="stockStatus">
        <Select id="stockStatus" name="stockStatus" defaultValue={product?.stockStatus ?? "IN_STOCK"}>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </Select>
      </Field>

      <MultiImageUpload
        name="images"
        label="Product Images"
        folder="products"
        defaultValue={product?.images}
      />

      <FileUpload
        name="brochureUrl"
        label="Brochure (PDF, optional)"
        folder="brochures"
        defaultValue={product?.brochureUrl}
      />

      <div className="flex gap-6">
        <Checkbox
          name="isFeatured"
          label="Featured on homepage"
          defaultChecked={product?.isFeatured ?? false}
        />
        <Checkbox
          name="isActive"
          label="Active (visible on site)"
          defaultChecked={product?.isActive ?? true}
        />
      </div>

      <SubmitButton>{product ? "Save Changes" : "Create Product"}</SubmitButton>
    </form>
    </UploadPendingProvider>
  );
}

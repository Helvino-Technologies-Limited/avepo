import { Field, TextInput, TextArea, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Testimonial } from "@prisma/client";
import { UploadPendingProvider } from "@/components/upload-pending-context";

export function TestimonialForm({
  action,
  testimonial,
}: {
  action: (formData: FormData) => Promise<void>;
  testimonial?: Testimonial;
}) {
  return (
    <UploadPendingProvider>
        <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <TextInput id="name" name="name" required defaultValue={testimonial?.name} />
        </Field>
        <Field label="Role / Farm (optional)" htmlFor="role">
          <TextInput id="role" name="role" defaultValue={testimonial?.role ?? ""} />
        </Field>
      </div>

      <Field label="Quote" htmlFor="quote">
        <TextArea id="quote" name="quote" required defaultValue={testimonial?.quote} />
      </Field>

      <Field label="Rating (1-5, optional)" htmlFor="rating">
        <TextInput
          id="rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={testimonial?.rating ?? ""}
        />
      </Field>

      <ImageUpload name="photo" label="Photo" folder="testimonials" defaultValue={testimonial?.photo} />

      <div className="flex gap-6">
        <Checkbox name="isFeatured" label="Featured" defaultChecked={testimonial?.isFeatured ?? false} />
        <Checkbox name="isActive" label="Active" defaultChecked={testimonial?.isActive ?? true} />
      </div>

      <SubmitButton>{testimonial ? "Save Changes" : "Create Testimonial"}</SubmitButton>
    </form>
    </UploadPendingProvider>
  );
}

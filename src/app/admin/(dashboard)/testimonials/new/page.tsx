import { TestimonialForm } from "../testimonial-form";
import { createTestimonial } from "../actions";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Testimonial</h1>
      <div className="mt-6 max-w-2xl">
        <TestimonialForm action={createTestimonial} />
      </div>
    </div>
  );
}

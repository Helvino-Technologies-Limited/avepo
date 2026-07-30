import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TestimonialForm } from "../testimonial-form";
import { updateTestimonial } from "../actions";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Testimonial</h1>
      <div className="mt-6 max-w-2xl">
        <TestimonialForm action={updateTestimonial.bind(null, id)} testimonial={testimonial} />
      </div>
    </div>
  );
}

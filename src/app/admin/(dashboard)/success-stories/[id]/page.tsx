import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SuccessStoryForm } from "../success-story-form";
import { updateSuccessStory } from "../actions";

export default async function EditSuccessStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await prisma.successStory.findUnique({ where: { id } });
  if (!story) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Success Story</h1>
      <div className="mt-6 max-w-2xl">
        <SuccessStoryForm action={updateSuccessStory.bind(null, id)} story={story} />
      </div>
    </div>
  );
}

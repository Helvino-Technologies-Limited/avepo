import { SuccessStoryForm } from "../success-story-form";
import { createSuccessStory } from "../actions";

export default function NewSuccessStoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Success Story</h1>
      <div className="mt-6 max-w-2xl">
        <SuccessStoryForm action={createSuccessStory} />
      </div>
    </div>
  );
}

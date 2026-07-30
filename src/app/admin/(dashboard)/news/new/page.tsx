import { NewsForm } from "../news-form";
import { createNewsPost } from "../actions";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add News Post</h1>
      <div className="mt-6 max-w-2xl">
        <NewsForm action={createNewsPost} />
      </div>
    </div>
  );
}

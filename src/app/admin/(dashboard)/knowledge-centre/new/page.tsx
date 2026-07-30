import { ArticleForm } from "../article-form";
import { createArticle } from "../actions";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Article</h1>
      <div className="mt-6 max-w-2xl">
        <ArticleForm action={createArticle} />
      </div>
    </div>
  );
}

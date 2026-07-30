import { Field, TextInput, Select, Checkbox, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toDatetimeLocalValue } from "@/lib/date";
import { sanitizeHtml } from "@/lib/sanitize";
import type { NewsPost } from "@prisma/client";

export function NewsForm({
  action,
  post,
}: {
  action: (formData: FormData) => Promise<void>;
  post?: NewsPost;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={post?.title} />
      </Field>

      <Field label="Category" htmlFor="category">
        <TextInput
          id="category"
          name="category"
          placeholder="e.g. Weather Alert, Promotion, Product Update"
          defaultValue={post?.category ?? ""}
        />
      </Field>

      <RichTextEditor
        name="body"
        label="Body"
        defaultValue={post?.body ? sanitizeHtml(post.body) : post?.body}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={post?.status ?? "DRAFT"}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
          </Select>
        </Field>
        <Field label="Publish At (for Scheduled)" htmlFor="publishAt">
          <TextInput
            id="publishAt"
            name="publishAt"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(post?.publishAt)}
          />
        </Field>
      </div>

      <ImageUpload name="coverImage" label="Cover Image" folder="news" defaultValue={post?.coverImage} />

      <MultiImageUpload name="media" label="Additional Media" folder="news" defaultValue={post?.media} />

      <Checkbox name="isFeatured" label="Featured" defaultChecked={post?.isFeatured ?? false} />

      <SubmitButton>{post ? "Save Changes" : "Create Post"}</SubmitButton>
    </form>
  );
}

import { Field, TextInput, Select, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import type { GalleryAlbum } from "@prisma/client";
import { UploadPendingProvider } from "@/components/upload-pending-context";

export function AlbumForm({
  action,
  album,
}: {
  action: (formData: FormData) => Promise<void>;
  album?: GalleryAlbum;
}) {
  return (
    <UploadPendingProvider>
        <form action={action} className="space-y-4">
      <Field label="Album Title" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={album?.title} />
      </Field>

      <Field label="Type" htmlFor="type">
        <Select id="type" name="type" defaultValue={album?.type ?? "EVENTS"}>
          <option value="EVENTS">Events</option>
          <option value="PRODUCTS">Products</option>
          <option value="SMART_FARM">Smart Farm</option>
          <option value="BRANCHES">Branches</option>
          <option value="FARMERS">Farmers</option>
        </Select>
      </Field>

      <ImageUpload
        name="coverImage"
        label="Cover Image"
        folder="gallery"
        defaultValue={album?.coverImage}
      />

      <SubmitButton>{album ? "Save Changes" : "Create Album"}</SubmitButton>
    </form>
    </UploadPendingProvider>
  );
}

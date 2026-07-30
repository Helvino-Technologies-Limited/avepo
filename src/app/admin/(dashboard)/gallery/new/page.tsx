import { AlbumForm } from "../album-form";
import { createAlbum } from "../actions";

export default function NewAlbumPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Album</h1>
      <div className="mt-6 max-w-2xl">
        <AlbumForm action={createAlbum} />
      </div>
    </div>
  );
}

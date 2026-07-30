import type { Branch } from "@prisma/client";

export function BranchCard({ branch }: { branch: Branch }) {
  const mapSrc =
    branch.lat != null && branch.lng != null
      ? `https://www.google.com/maps?q=${branch.lat},${branch.lng}&output=embed`
      : null;
  const directionsHref =
    branch.lat != null && branch.lng != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`
      : branch.address
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.address)}`
      : null;
  const whatsappDigits = branch.whatsapp?.replace(/\D/g, "");

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {branch.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={branch.photo} alt={branch.name} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
          No photo yet
        </div>
      )}

      <div className="p-4">
        <div className="font-medium text-neutral-900">{branch.name}</div>
        {branch.address && <div className="mt-1 text-sm text-neutral-600">{branch.address}</div>}
        {branch.hours && <div className="mt-1 text-xs text-neutral-500">{branch.hours}</div>}
        {branch.phone && <div className="mt-1 text-sm text-neutral-600">{branch.phone}</div>}

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {branch.phone && (
            <a href={`tel:${branch.phone}`} className="rounded-md border border-neutral-300 px-2 py-1 hover:bg-neutral-50">
              Call
            </a>
          )}
          {whatsappDigits && (
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#25D366] px-2 py-1 text-white"
            >
              WhatsApp
            </a>
          )}
          {directionsHref && (
            <a
              href={directionsHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-neutral-300 px-2 py-1 hover:bg-neutral-50"
            >
              Get Directions
            </a>
          )}
        </div>

        {mapSrc && (
          <iframe
            src={mapSrc}
            title={`Map to ${branch.name}`}
            className="mt-3 h-40 w-full rounded-md border-0"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}

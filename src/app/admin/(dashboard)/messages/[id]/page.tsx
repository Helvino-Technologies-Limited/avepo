import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { markMessageRead } from "../actions";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) notFound();

  if (!message.isRead) {
    await markMessageRead(id);
  }

  const replySubject = encodeURIComponent(`Re: ${message.subject || "Your enquiry to Avepo"}`);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/messages" className="text-sm text-green-700 hover:underline">
        ← Back to Messages
      </Link>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-neutral-900">{message.subject || "General Enquiry"}</h1>
        <p className="mt-1 text-sm text-neutral-500">{message.createdAt.toLocaleString()}</p>

        <dl className="mt-4 space-y-1 text-sm">
          <div>
            <dt className="inline font-medium text-neutral-700">From: </dt>
            <dd className="inline text-neutral-800">
              {message.name} ({message.email})
            </dd>
          </div>
          {message.phone && (
            <div>
              <dt className="inline font-medium text-neutral-700">Phone: </dt>
              <dd className="inline text-neutral-800">{message.phone}</dd>
            </div>
          )}
        </dl>

        <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-800">{message.message}</p>

        <div className="mt-6 flex gap-3">
          {message.phone && (
            <a
              href={`tel:${message.phone}`}
              className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Call {message.phone}
            </a>
          )}
          <a
            href={`mailto:${message.email}?subject=${replySubject}`}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Reply by Email
          </a>
        </div>
      </div>
    </div>
  );
}

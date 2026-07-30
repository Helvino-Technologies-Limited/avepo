import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/row-actions";
import { deleteMessage } from "./actions";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Messages</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Enquiries submitted through the public contact form.
      </p>

      {messages.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          No messages yet.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-2 font-medium">From</th>
                <th className="px-4 py-2 font-medium">Subject</th>
                <th className="px-4 py-2 font-medium">Received</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr
                  key={m.id}
                  className={`border-b border-neutral-100 last:border-0 ${
                    m.isRead ? "" : "bg-green-50/60"
                  }`}
                >
                  <td className="px-4 py-2">
                    <div className={m.isRead ? "text-neutral-800" : "font-semibold text-neutral-900"}>
                      {m.name}
                    </div>
                    <div className="text-xs text-neutral-500">{m.email}</div>
                  </td>
                  <td className="px-4 py-2">{m.subject ?? "—"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{m.createdAt.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {m.isRead ? (
                      <span className="text-xs text-neutral-500">Read</span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                        Unread
                      </span>
                    )}
                  </td>
                  <td className="space-x-3 px-4 py-2 whitespace-nowrap">
                    <Link href={`/admin/messages/${m.id}`} className="text-green-700 hover:underline">
                      View
                    </Link>
                    <DeleteButton action={deleteMessage.bind(null, m.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

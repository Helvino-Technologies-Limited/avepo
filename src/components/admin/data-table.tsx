import Link from "next/link";
import type { ReactNode } from "react";

export type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  editHref,
  emptyMessage,
  rowActions,
}: {
  columns: Column<T>[];
  rows: T[];
  editHref?: (row: T) => string;
  emptyMessage: string;
  rowActions?: (row: T) => ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-2 font-medium">
                {col.header}
              </th>
            ))}
            <th className="px-4 py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-neutral-100 last:border-0">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-2">
                  {col.render(row)}
                </td>
              ))}
              <td className="space-x-3 px-4 py-2 whitespace-nowrap">
                {editHref && (
                  <Link href={editHref(row)} className="text-green-700 hover:underline">
                    Edit
                  </Link>
                )}
                {rowActions?.(row)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

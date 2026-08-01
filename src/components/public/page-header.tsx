import { SiteNav } from "@/components/public/site-nav";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <SiteNav variant="bar" />
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-[var(--brand-primary-dark)]">{title}</h1>
          {subtitle && <p className="mt-2 text-neutral-600">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-600">
      {message}
    </div>
  );
}

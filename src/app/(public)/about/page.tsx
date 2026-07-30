import { PageHeader } from "@/components/public/page-header";

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Avepo Enterprises"
        subtitle="Serving farmers across Siaya County with agro-inputs, animal health, and Smart Farm expertise."
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Our Vision</h2>
            <p className="mt-2 text-sm text-neutral-600">Editable from the Admin Portal.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Our Mission</h2>
            <p className="mt-2 text-sm text-neutral-600">Editable from the Admin Portal.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Core Values</h2>
            <p className="mt-2 text-sm text-neutral-600">Editable from the Admin Portal.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Why Choose Avepo</h2>
            <p className="mt-2 text-sm text-neutral-600">Editable from the Admin Portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

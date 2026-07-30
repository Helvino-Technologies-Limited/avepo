import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { PageHeader } from "@/components/public/page-header";
import { ContactForm } from "@/components/public/contact-form";

export default async function ContactPage() {
  const [branches, contact] = await Promise.all([
    prisma.branch.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    getSiteSetting("contact.general"),
  ]);

  return (
    <div>
      <PageHeader
        title="Contact Us"
        subtitle="Reach out to our head office or any of our branches across Siaya County."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Send us a message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">General Contact</h2>
          <p className="mt-2 text-sm text-neutral-600">
            {contact.phone} · {contact.email}
          </p>

          <h2 className="mt-6 text-lg font-semibold text-neutral-900">Branches</h2>
          <ul className="mt-2 space-y-3">
            {branches.map((branch) => (
              <li key={branch.id} className="rounded-lg border border-neutral-200 p-3 text-sm">
                <div className="font-medium text-neutral-900">{branch.name}</div>
                {branch.address && <div className="text-neutral-600">{branch.address}</div>}
                {branch.phone && <div className="text-neutral-600">{branch.phone}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

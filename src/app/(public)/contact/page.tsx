import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { PageHeader } from "@/components/public/page-header";
import { ContactForm } from "@/components/public/contact-form";
import { BranchCard } from "@/components/public/branch-card";
import { SITE_URL } from "@/lib/site";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Get in touch with Avepo Enterprises Limited — reach our head office or any branch across Siaya County, Kenya.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/contact` },
};

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
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Send us a message</h2>
            <div className="mt-4">
              <Suspense>
                <ContactForm />
              </Suspense>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">General Contact</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {contact.phone} · {contact.email}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-lg font-semibold text-neutral-900">Our Branches</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

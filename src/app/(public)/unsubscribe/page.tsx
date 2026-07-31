import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { unsubscribe } from "./actions";

export const metadata: Metadata = {
  title: "Unsubscribed",
  description: "Manage your Avepo Enterprises Limited email subscription preferences.",
  robots: { index: false, follow: true },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (email) {
    await unsubscribe(email);
  }

  return (
    <div>
      <PageHeader title="Unsubscribed" />
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-sm text-neutral-600">
          {email
            ? `${email} has been unsubscribed from Avepo email updates. You can resubscribe anytime from the homepage.`
            : "No email address provided."}
        </p>
      </div>
    </div>
  );
}

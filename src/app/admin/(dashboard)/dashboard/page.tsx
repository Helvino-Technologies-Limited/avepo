import Link from "next/link";
import { prisma } from "@/lib/db";

async function getCounts() {
  const [
    products,
    services,
    events,
    messages,
    subscribers,
    galleryItems,
    branches,
    partners,
    pendingOrders,
    pendingReviews,
    testimonials,
    successStories,
    downloads,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.service.count(),
    prisma.event.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.subscriber.count({ where: { isActive: true } }),
    prisma.galleryMedia.count(),
    prisma.branch.count(),
    prisma.partner.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.testimonial.count(),
    prisma.successStory.count(),
    prisma.download.count(),
  ]);

  return {
    products,
    services,
    events,
    messages,
    subscribers,
    galleryItems,
    branches,
    partners,
    pendingOrders,
    pendingReviews,
    testimonials,
    successStories,
    downloads,
  };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  const stats: { label: string; value: number }[] = [
    { label: "Pending Orders", value: counts.pendingOrders },
    { label: "Pending Reviews", value: counts.pendingReviews },
    { label: "Products", value: counts.products },
    { label: "Services", value: counts.services },
    { label: "Events", value: counts.events },
    { label: "Unread Messages", value: counts.messages },
    { label: "Active Subscribers", value: counts.subscribers },
    { label: "Gallery Items", value: counts.galleryItems },
    { label: "Branches", value: counts.branches },
    { label: "Partners", value: counts.partners },
  ];

  const gettingStarted = [
    { label: "Add your first products", count: counts.products, href: "/admin/products" },
    { label: "Add an upcoming event", count: counts.events, href: "/admin/events" },
    { label: "Add farmer testimonials", count: counts.testimonials, href: "/admin/testimonials" },
    { label: "Add a success story", count: counts.successStories, href: "/admin/success-stories" },
    { label: "Upload a downloadable brochure/price list", count: counts.downloads, href: "/admin/downloads" },
  ].filter((item) => item.count === 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Overview of your website content.</p>

      {gettingStarted.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">
            Getting Started — these sections are empty on the public site
          </h2>
          <ul className="mt-2 space-y-1">
            {gettingStarted.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-amber-800 underline hover:text-amber-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="text-sm text-neutral-500">{stat.label}</div>
            <div className="mt-1 text-3xl font-semibold text-neutral-900">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

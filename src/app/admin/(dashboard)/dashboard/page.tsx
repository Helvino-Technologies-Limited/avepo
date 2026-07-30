import { prisma } from "@/lib/db";

async function getCounts() {
  const [
    products,
    services,
    news,
    events,
    messages,
    subscribers,
    galleryItems,
    branches,
    partners,
    jobs,
    pendingOrders,
    pendingReviews,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.service.count(),
    prisma.newsPost.count(),
    prisma.event.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.subscriber.count({ where: { isActive: true } }),
    prisma.galleryMedia.count(),
    prisma.branch.count(),
    prisma.partner.count(),
    prisma.jobPosting.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  return {
    products,
    services,
    news,
    events,
    messages,
    subscribers,
    galleryItems,
    branches,
    partners,
    jobs,
    pendingOrders,
    pendingReviews,
  };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  const stats: { label: string; value: number }[] = [
    { label: "Pending Orders", value: counts.pendingOrders },
    { label: "Pending Reviews", value: counts.pendingReviews },
    { label: "Products", value: counts.products },
    { label: "Services", value: counts.services },
    { label: "News Posts", value: counts.news },
    { label: "Events", value: counts.events },
    { label: "Unread Messages", value: counts.messages },
    { label: "Active Subscribers", value: counts.subscribers },
    { label: "Gallery Items", value: counts.galleryItems },
    { label: "Branches", value: counts.branches },
    { label: "Partners", value: counts.partners },
    { label: "Open Job Postings", value: counts.jobs },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Overview of your website content.</p>

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

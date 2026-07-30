import { prisma } from "@/lib/db";

async function getCounts() {
  const [products, news, events, messages, subscribers, galleryItems, branches] =
    await Promise.all([
      prisma.product.count(),
      prisma.newsPost.count(),
      prisma.event.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.galleryMedia.count(),
      prisma.branch.count(),
    ]);

  return { products, news, events, messages, subscribers, galleryItems, branches };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  const stats: { label: string; value: number }[] = [
    { label: "Products", value: counts.products },
    { label: "News Posts", value: counts.news },
    { label: "Events", value: counts.events },
    { label: "Unread Messages", value: counts.messages },
    { label: "Active Subscribers", value: counts.subscribers },
    { label: "Gallery Items", value: counts.galleryItems },
    { label: "Branches", value: counts.branches },
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

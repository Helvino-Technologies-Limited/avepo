import Link from "next/link";
import { can } from "@/lib/rbac";
import type { Role } from "@prisma/client";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/success-stories", label: "Success Stories" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/smart-farm", label: "Smart Farm" },
  { href: "/admin/knowledge-centre", label: "Knowledge Centre" },
  { href: "/admin/downloads", label: "Downloads" },
  { href: "/admin/branches", label: "Branches" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "Users", requires: "manageUsers" as const },
];

export function Sidebar({ role }: { role: Role }) {
  return (
    <nav className="flex h-full w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-neutral-200 bg-white p-4">
      <div className="mb-4 px-2 text-lg font-semibold text-green-800">Avepo Admin</div>
      {NAV_ITEMS.filter((item) => !item.requires || can(role, item.requires)).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-green-50 hover:text-green-800"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

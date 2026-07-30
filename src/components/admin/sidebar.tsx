import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "Users" },
];

export function Sidebar() {
  return (
    <nav className="flex h-full w-56 shrink-0 flex-col gap-1 border-r border-neutral-200 bg-white p-4">
      <div className="mb-4 px-2 text-lg font-semibold text-green-800">Avepo Admin</div>
      {NAV_ITEMS.map((item) => (
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

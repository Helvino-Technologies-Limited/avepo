"use client";

import { useState } from "react";
import Link from "next/link";
import { can } from "@/lib/rbac";
import type { Role } from "@prisma/client";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/farmer-tips", label: "Farmer Tips" },
  { href: "/admin/farmer-tips/comments", label: "Tip Comments" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/success-stories", label: "Success Stories" },
  { href: "/admin/smart-farm", label: "Smart Farm" },
  { href: "/admin/downloads", label: "Downloads" },
  { href: "/admin/branches", label: "Branches" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "Users", requires: "manageUsers" as const },
];

function NavLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  return (
    <>
      {NAV_ITEMS.filter((item) => !item.requires || can(role, item.requires)).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-green-50 hover:text-green-800"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function Sidebar({ role }: { role: Role }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar with menu toggle */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
        <span className="text-lg font-semibold text-green-800">Avepo Admin</span>
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 text-neutral-700"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <nav className="flex flex-col gap-1 border-b border-neutral-200 bg-white p-4 md:hidden">
          <NavLinks role={role} onNavigate={() => setIsOpen(false)} />
        </nav>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden h-full w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-neutral-200 bg-white p-4 md:flex">
        <div className="mb-4 px-2 text-lg font-semibold text-green-800">Avepo Admin</div>
        <NavLinks role={role} />
      </nav>
    </>
  );
}

import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";

export async function Footer() {
  const [branches, contact, social] = await Promise.all([
    prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    getSiteSetting("contact.general"),
    getSiteSetting("social.links"),
  ]);

  const socialEntries = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-lg font-bold text-white">Avepo Enterprises</div>
            <p className="mt-2 text-sm">
              Agro-inputs, animal health, and Smart Farm expertise across Siaya County.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Branches</div>
            <ul className="mt-2 space-y-1 text-sm">
              {branches.map((branch) => (
                <li key={branch.id}>
                  {branch.name}
                  {branch.phone ? ` — ${branch.phone}` : ""}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Contact</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Follow us</div>
            <ul className="mt-2 space-y-1 text-sm">
              {socialEntries.length === 0 && <li className="text-neutral-500">Coming soon</li>}
              {socialEntries.map(([platform, url]) => (
                <li key={platform}>
                  <a href={url} className="capitalize hover:text-white">
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
          © {new Date().getFullYear()} Avepo Enterprises Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

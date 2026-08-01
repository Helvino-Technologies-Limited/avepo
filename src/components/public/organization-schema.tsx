import { prisma } from "@/lib/db";
import { getSiteSetting } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export async function OrganizationSchema() {
  const [logo, contact, social, headBranch] = await Promise.all([
    getSiteSetting("branding.logo"),
    getSiteSetting("contact.general"),
    getSiteSetting("social.links"),
    prisma.branch.findFirst({ where: { isActive: true }, orderBy: { order: "asc" } }),
  ]);

  const sameAs = Object.entries(social)
    .filter(([key, value]) => value && key !== "whatsapp")
    .map(([, value]) => value);

  const address = {
    "@type": "PostalAddress",
    ...(headBranch?.address ? { streetAddress: headBranch.address } : {}),
    addressRegion: "Siaya County",
    addressCountry: "KE",
  };

  const geo =
    headBranch?.lat != null && headBranch?.lng != null
      ? { "@type": "GeoCoordinates", latitude: headBranch.lat, longitude: headBranch.lng }
      : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Avepo Agrovets Limited",
    alternateName: "Avepo",
    slogan: "Our Farms, Our Future",
    url: SITE_URL,
    logo: logo.url || `${SITE_URL}/avepo-logo.jpg`,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    address,
    ...(geo ? { geo } : {}),
    ...(contact.phone || contact.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(contact.phone ? { telephone: contact.phone } : {}),
            ...(contact.email ? { email: contact.email } : {}),
            areaServed: "KE",
          },
        }
      : {}),
  };

  // Escape "<" so a value containing the literal string "</script>" can't
  // break out of the script tag (JSON.stringify alone doesn't escape it).
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

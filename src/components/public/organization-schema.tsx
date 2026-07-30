import { getSiteSetting } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export async function OrganizationSchema() {
  const [logo, contact, social] = await Promise.all([
    getSiteSetting("branding.logo"),
    getSiteSetting("contact.general"),
    getSiteSetting("social.links"),
  ]);

  const sameAs = Object.entries(social)
    .filter(([key, value]) => value && key !== "whatsapp")
    .map(([, value]) => value);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Avepo Enterprises Limited",
    url: SITE_URL,
    ...(logo.url ? { logo: logo.url } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Siaya County",
      addressCountry: "KE",
    },
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

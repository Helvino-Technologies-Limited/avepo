import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getSiteSetting } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";
import { OrganizationSchema } from "@/components/public/organization-schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "Avepo Enterprises Limited | Agro-Inputs, Animal Health & Smart Farm Solutions in Kenya";
const SITE_DESCRIPTION =
  "Avepo Enterprises Limited — Our Farms, Our Future. Trusted agro-inputs, animal health products, farm consultancy, and Smart Farm technology, serving farmers across Kenya for over 15 years.";
const SITE_KEYWORDS = [
  "Avepo",
  "Avepo Enterprises",
  "Avepo Enterprises Limited",
  "agrovet Kenya",
  "agro-inputs Kenya",
  "animal health products Kenya",
  "farm consultancy Kenya",
  "Smart Farm Kenya",
  "Siaya County agrovet",
  "farm inputs supplier Kenya",
];

export async function generateMetadata(): Promise<Metadata> {
  const logo = await getSiteSetting("branding.logo");
  const ogImageUrl = logo.url || `${SITE_URL}/avepo-logo.jpg`;
  const ogImages = [{ url: ogImageUrl }];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_TITLE, template: "%s | Avepo Enterprises" },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    alternates: { canonical: SITE_URL },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: "Avepo Enterprises Limited",
      images: ogImages,
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

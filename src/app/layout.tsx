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

const SITE_TITLE = "Avepo Enterprises | Agrovets & Smart Farm";
const SITE_DESCRIPTION =
  "Avepo Enterprises Limited - agro-inputs, animal health, farm consultancy, and Smart Farm expertise across Siaya County.";

export async function generateMetadata(): Promise<Metadata> {
  const logo = await getSiteSetting("branding.logo");
  const ogImages = logo.url ? [{ url: logo.url }] : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_TITLE, template: "%s | Avepo Enterprises" },
    description: SITE_DESCRIPTION,
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: "Avepo Enterprises",
      images: ogImages,
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: ogImages?.map((i) => i.url),
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

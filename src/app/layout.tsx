import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { CmsLiveRefresh } from "@/components/cms/CmsLiveRefresh";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { site, socialLinks } from "@/content/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist",
  display: "swap"
});

const boska = localFont({
  src: [{ path: "./fonts/Boska-Bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-boska",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Daniel Ghaly",
    template: "Daniel Ghaly"
  },
  description: site.description,
  openGraph: {
    title: "Daniel Ghaly",
    description: site.description,
    url: site.url,
    siteName: "Daniel Ghaly",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Daniel Ghaly wordmark on a dark editorial background"
      }
    ],
    locale: "en_CA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Ghaly",
    description: site.description,
    images: ["/opengraph-image"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E0E10"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Ghaly",
    jobTitle: "Designer and Co-founder",
    worksFor: {
      "@type": "Organization",
      name: "Graphxify"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mississauga",
      addressRegion: "ON",
      addressCountry: "CA"
    },
    sameAs: socialLinks.filter((link) => link.label !== "Email").map((link) => link.href)
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${boska.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <CmsLiveRefresh />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}

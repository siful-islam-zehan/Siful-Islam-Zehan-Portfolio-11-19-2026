import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, Archivo } from "next/font/google";
import "@/styles/globals.css";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { PageTransitionBar } from "@/components/animations/PageTransitionBar";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const SITE_URL = "https://sifulislamzehan.dev";

export const metadata: Metadata = {
  title: "Siful Islam Zehan (Zehan) — UI/UX Designer & Front-End Designer",
  description:
    "Designing digital experiences. Bringing ideas to life. I work across UI/UX design, website design, product interfaces, and front-end implementation to create meaningful digital experiences.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  keywords: [
    "UI/UX Design",
    "Front-End Designer",
    "Product Design",
    "Website Design",
    "SaaS Dashboard Design",
    "Design Exhibition",
    "Zehan",
    "Siful Islam Zehan",
    "Dhaka Designer",
    "Design Systems",
  ],
  authors: [{ name: "Siful Islam Zehan", url: SITE_URL }],
  creator: "Siful Islam Zehan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Siful Islam Zehan (Zehan) — UI/UX Designer & Front-End Designer",
    description:
      "Designing digital experiences. Bringing ideas to life. Editorial, interactive design exhibition portfolio.",
    siteName: "Siful Islam Zehan Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Siful Islam Zehan — UI/UX Designer & Front-End Designer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siful Islam Zehan (Zehan) — UI/UX Designer & Front-End Designer",
    description:
      "Designing digital experiences. Bringing ideas to life. Editorial, interactive design exhibition portfolio.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F1EC",
  width: "device-width",
  initialScale: 1,
};

// Schema.org Structured Data (Person + WebSite)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Siful Islam Zehan",
      alternateName: "Zehan",
      url: SITE_URL,
      image: `${SITE_URL}/images/profile/zehan-portrait.png`,
      jobTitle: "UI/UX Designer & Front-End Designer",
      description:
        "Designing digital experiences. Bringing ideas to life. I work across UI/UX design, website design, product interfaces, and front-end implementation to create meaningful digital experiences.",
      email: "mailto:hello@sifulislamzehan.dev",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
      knowsAbout: [
        "UI/UX Design",
        "Website Design",
        "Product Design",
        "Front-End Implementation",
        "Design Systems",
        "Wireframing & Prototyping",
        "SaaS Dashboard Design",
      ],
      sameAs: [
        "https://github.com/siful-islam-zehan",
        "https://behance.net/placeholder",
        "https://linkedin.com/in/placeholder",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Siful Islam Zehan — UI/UX Designer & Front-End Designer",
      publisher: {
        "@id": `${SITE_URL}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${manrope.variable} ${archivo.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground selection:bg-foreground selection:text-background min-h-screen flex flex-col">
        {/* Accessible Skip Link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Main Content Landmark */}
        <main id="main-content" role="main" className="flex-1 w-full">
          {children}
        </main>

        {/* Hairline Page Transition */}
        <PageTransitionBar />

        {/* Custom Editorial Cursor (Desktop Only) */}
        <CustomCursor />
      </body>
    </html>
  );
}

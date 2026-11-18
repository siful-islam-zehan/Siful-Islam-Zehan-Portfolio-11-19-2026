import { notFound } from "next/navigation";
import StyleguideClient from "./StyleguideClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System & Styleguide (Dev Only) | Zehan",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleguidePage() {
  // Protect route in production: Return 404 so development assets are never exposed publicly
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StyleguideClient />;
}

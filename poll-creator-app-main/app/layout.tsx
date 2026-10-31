import type { Metadata } from "next";
import { Gabarito, Karla } from "next/font/google";
import "./globals.css";

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RoundTable — Planning poker for product teams",
    template: "%s · RoundTable",
  },
  description:
    "RoundTable helps product teams estimate backlog stories together with private planning poker, a clear team reference point, and fast team decision-making.",
  applicationName: "RoundTable",
  keywords: [
    "RoundTable planning poker",
    "planning poker",
    "story points",
    "backlog refinement",
    "agile estimation",
    "team voting",
    "group decision tool",
    "product planning",
    "sprint planning",
    "meeting decisions",
  ],
  openGraph: {
    type: "website",
    siteName: "RoundTable",
    title: "RoundTable — Planning poker for product teams",
    description:
      "Estimate backlog stories independently, reveal the cards together, and align on a shared team decision.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoundTable — Planning poker for product teams",
    description:
      "Estimate backlog stories independently, reveal the cards together, and align on a shared team decision.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gabarito.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}

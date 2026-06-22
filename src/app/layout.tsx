import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mind the Mind — It's plotting something.",
  description:
    "A 60-second trading game where the AI has a hidden objective. You get three questions before it acts. Reading its mind is how you win. Lab Experiment 001.",
  metadataBase: new URL("https://mind-the-mind.vercel.app"),
  openGraph: {
    title: "Mind the Mind — It's plotting something.",
    description:
      "60 seconds. Three questions. One hidden objective. Read its mind, beat the bonding curve.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mind the Mind",
    description:
      "60 seconds. Three questions. One hidden objective. Read its mind, beat the bonding curve.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-surface font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

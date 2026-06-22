import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
    "A 60-second trading game where the AI has a hidden objective. You get three questions before it acts. Reading its mind is how you win. Lab Experiment 001, built for the Mad Easy on Cosmos hackathon.",
  metadataBase: new URL("https://mindthemind.xyz"),
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
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="lab-bg scanlines grain font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

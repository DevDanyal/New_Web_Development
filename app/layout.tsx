import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Dev Danyal | E-commerce & SaaS Developer",
  description: "AI-driven developer specializing in e-commerce, SaaS, and automation. Building intelligent solutions with Next.js, React, and AI.",
  keywords: ["AI developer", "e-commerce developer", "SaaS developer", "Next.js", "React", "AI automation"],
  authors: [{ name: "Danyal" }],
  openGraph: {
    title: "AI Dev Danyal - Building Intelligent E-commerce & SaaS Solutions",
    description: "Full-stack developer specializing in AI-powered applications. From concept to deployment in weeks, not months.",
    url: "https://aidevdanyal.com",
    siteName: "AI Dev Danyal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Dev Danyal | E-commerce & SaaS Developer",
    description: "Building intelligent applications with AI. E-commerce • SaaS • Automation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}>
      <body className="font-primary antialiased">
        {children}
      </body>
    </html>
  );
}

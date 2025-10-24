import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Routerize Tech",
  description: "Modern Next.js Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["Routerize", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Routerize" }],
  openGraph: {
    title: "Routerize Tech",
    description: "AI-powered development with modern React stack",
    url: "https://chat.z.ai",
    siteName: "Routerize Tech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Routerize Tech",
    description: "AI-powered development with modern React stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

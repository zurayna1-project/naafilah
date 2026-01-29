import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
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

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zurayna",
  description: "Ruang pribadi untuk kumpulan puisi dengan nuansa tenang dan kontemplatif.",
  keywords: ["puisi", "sajak", "literasi", "karya sastra", "Zurayna"],
  authors: [{ name: "Zurayna" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Zurayna",
    description: "Ruang pribadi untuk sebuah puisi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

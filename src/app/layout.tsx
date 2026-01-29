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
  // PENTING: Ganti dengan domain aslimu agar gambar relatif bisa terbaca
  metadataBase: new URL('https://zurayna.site'), 

  title: {
    default: "Zurayna",
    template: "%s | Zurayna", // Contoh hasil: "Judul Puisi | Zurayna"
  },
  description: "Ruang pribadi untuk kumpulan puisi dengan nuansa tenang dan kontemplatif.",
  keywords: ["puisi", "sajak", "literasi", "karya sastra", "Zurayna", "blog puisi"],
  authors: [{ name: "Zurayna" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Zurayna",
    description: "Ruang pribadi untuk kumpulan puisi dengan nuansa tenang dan kontemplatif.",
    url: 'https://zurayna.site',
    siteName: 'Zurayna',
    locale: 'id_ID',
    type: "website",
    images: [
      {
        url: '/og-image.png', // Pastikan file ini ada di folder public
        width: 1200,
        height: 630,
        alt: 'Zurayna - Ruang Puisi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zurayna',
    description: 'Ruang pribadi untuk kumpulan puisi',
    images: ['/og-image.png'], // Gambar default jika halaman tidak punya gambar khusus
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
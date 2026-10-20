import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Markas Endog - Admin Dashboard",
  description: "Sistem Informasi Manajemen Produksi dan Inventaris Peternakan Ayam Petelur",
  keywords: ["peternakan", "ayam petelur", "manajemen produksi", "markas endog"],
  openGraph: {
    title: "Markas Endog",
    description: "Dashboard manajemen peternakan ayam petelur modern",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

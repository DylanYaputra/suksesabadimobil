import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Sukses Abadi Mobil - Showroom Mobil Bekas Medan",
  description: "Showroom mobil bekas terpercaya di Medan. Temukan mobil bekas berkualitas dengan harga terbaik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
        <WhatsAppButton />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Zenith Workspace — Salas de reunião e co-working por hora",
  description:
    "Encontre e reserve salas de reunião e espaços de co-working por hora, com check-in por QR Code.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

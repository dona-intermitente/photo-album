import type { Metadata } from "next";
import { Special_Elite, Iosevka_Charon_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
});

const iosevkaCharonMono = Iosevka_Charon_Mono({
  variable: "--font-iosevka-charon-mono",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photo Album",
  description: "Interactive Digital Photo Album",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        specialElite.variable,
        iosevkaCharonMono.variable,
        "font-body",
      )}
    >
      <body className="h-full flex flex-col">{children}</body>
    </html>
  );
}

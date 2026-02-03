import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Equal Experts Product Listing",
  description: "Product Listing Page assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.className} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

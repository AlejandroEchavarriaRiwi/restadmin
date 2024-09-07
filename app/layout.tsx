import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const ubuntu = Onest({weight: "400", subsets: ["latin"]})


export const metadata: Metadata = {
  title: "RestAdmin",
  description: "Tu software de facturación en la nube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>{children}</body>
    </html>
  );
}

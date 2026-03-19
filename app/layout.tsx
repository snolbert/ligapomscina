import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Liga Pomścina",
  description: "Oficjalny portal ligi Warcraft III",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body id="top">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
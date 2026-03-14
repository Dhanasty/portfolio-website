import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import MagneticMenu from "@/components/MagneticMenu";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Dhanasekar S — AI Engineer & Creative Developer",
  description: "AI and data engineering enthusiast specialising in machine learning, computer vision, and scalable data pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {/* Global chrome — always on top */}
        <Preloader />
        <CustomCursor />
        <SmoothScroll />

        {/* Fixed top-left brand mark */}
        <a
          href="/"
          className="fixed top-6 left-8 z-50 transition-colors duration-300"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: "rgba(232,228,217,0.55)",
          }}
        >
          DS
        </a>

        {/* Hamburger + full-screen overlay */}
        <MagneticMenu />

        {/* Page wipe + content drift transition */}
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "McDonald's Payroll System — Montalban, Rizal",
  description:
    "Web-Based Payroll Management System for McDonald's Montalban (Rodriguez), Rizal. Manage employee payroll, attendance, and HR operations.",
  keywords: "McDonald's, payroll, Montalban, Rodriguez, Rizal, HR, attendance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${outfit.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(24, 24, 27, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(16px)",
              color: "#f4f4f5",
              fontSize: "13px",
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}

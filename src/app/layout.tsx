// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import UserProvider from "@/context/UserContext";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // ← critical
  preload: true,
  fallback: ["system-ui"], // ← fallback prevents invisible text
});

// Metadata for the Smart Inventory System App
export const metadata: Metadata = {
  title: "Smart Inventory System", // Main site title
  description:
    "A fully functional frontend-only Smart Inventory System built with Next.js, TypeScript, Tailwind CSS, and Shadcn. Manage products, orders, categories, and stock efficiently with a modern dashboard.",
  keywords: [
    "Inventory",
    "Dashboard",
    "Products",
    "Orders",
    "Categories",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Shadcn UI",
    "Frontend-only",
  ],
  authors: [{ name: "Mehedi Mehad" }],
  creator: "Mehedi Mehad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          {children}
          <Toaster richColors position="top-center" />
        </UserProvider>
      </body>
    </html>
  );
}

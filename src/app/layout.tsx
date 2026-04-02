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

export const metadata: Metadata = {
  title: "Align Admin Panel",
  description: "Manage your application easily.",
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

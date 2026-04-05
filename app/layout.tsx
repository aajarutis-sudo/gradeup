import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeScript from "@/components/theme/ThemeScript";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GradeUp",
  description: "Free, accessible GCSE revision with open learning tools, AI support, and a student-first non-profit mission.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body>
          <ThemeScript />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

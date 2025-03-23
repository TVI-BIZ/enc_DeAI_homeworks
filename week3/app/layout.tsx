import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story Generator2",
  description: "Generate stories with AI and manage characters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

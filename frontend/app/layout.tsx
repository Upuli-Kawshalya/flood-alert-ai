import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flood Alert AI | Sri Lanka",
  description: "AI-powered flood risk prediction and early warning system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
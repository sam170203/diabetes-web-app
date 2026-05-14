import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AIChatbot from "@/components/AIChatbot";

export const metadata: Metadata = {
  title: "DiaSense AI - Early Diabetes Risk Prediction",
  description: "AI-powered early diabetes risk estimation and preventive healthcare platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#030712]">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <AIChatbot />
      </body>
    </html>
  );
}
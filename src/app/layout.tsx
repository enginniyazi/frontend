// src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yowa Academy | Online Yazılım Eğitimleri",
  description: "Yowa Academy ile modern web geliştirme dünyasına adım atın.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full bg-gray-50">
      <body className={`${inter.className} flex flex-col h-full`}>
        <AuthProvider>
          <div className="min-h-screen bg-white">
            <Navbar />
            <div className="p-20">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

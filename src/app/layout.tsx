// src/app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yowa Academy | Online Yazılım Eğitimleri',
  description: 'Yowa Academy ile modern web geliştirme dünyasına adım atın.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full bg-gray-50">
      {/* 
        - body'yi dikey bir flex konteyner yapıyoruz (`flex flex-col`).
        - Yüksekliğinin de ebeveyni (html) kadar olmasını sağlıyoruz (`h-full`).
      */}
      <body className={`${inter.className} flex flex-col h-full`}>
        <AuthProvider>
          <Navbar />
          
          {/* 
            - main etiketi, geri kalan tüm esnek alanı doldurur (`flex-grow`).
            - İçindeki içeriğin (bizim DashboardLayout'umuz gibi) bu alanı
              nasıl kullanacağını kontrol etmesi için ona da bir flex konteyner veriyoruz.
          */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
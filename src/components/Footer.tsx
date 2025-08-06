// src/components/Footer.tsx

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>© {new Date().getFullYear()} Yowa Academy. Tüm Hakları Saklıdır.</p>
        <p className="text-sm text-gray-500 mt-2">
          Modern Web Geliştirme Yolculuğunuz Burada Başlar.
        </p>
      </div>
    </footer>
  );
}

// src/components/Navbar.tsx

"use client"; // Hook'ları (useAuth, useRouter) kullanabilmek için bu zorunludur.

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Mobil menü için

export default function Navbar() {
  // AuthContext'ten gerekli verileri ve fonksiyonları çekiyoruz
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");

  // Mobil menünün açık/kapalı durumunu tutan state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/"); // Çıkış yaptıktan sonra ana sayfaya yönlendir
  };

  // Auth durumu henüz kontrol ediliyorken (sayfa ilk yüklendiğinde)
  // Navbar'ın boş veya yanlış bir durumda görünmesini engellemek için.
  if (loading) {
    return (
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-[68px]">
          {/* Yüklenirken de yer kaplaması için bir iskelet gösteriyoruz */}
        </nav>
      </header>
    );
  }

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <Link href="/" className="ml-3 text-xl font-bold">
                Yowa Academy
              </Link>
            </div>

            {/* --- Masaüstü Navigasyon --- */}
            <div className="hidden lg:flex space-x-8">
              <Link
                href="/"
                className="font-medium transition-colors duration-200 text-gray-600 hover:text-purple-600"
              >
                Anasayfa
              </Link>
              <Link
                href="/courses"
                className="font-medium transition-colors duration-200 text-gray-600 hover:text-purple-600"
              >
                Kurslar
              </Link>
              <Link
                href="/instructors"
                className="font-medium transition-colors duration-200 text-gray-600 hover:text-purple-600"
              >
                Eğitmenler
              </Link>
              <Link
                href="/about"
                className="font-medium transition-colors duration-200 text-gray-600 hover:text-purple-600"
              >
                Hakkımızda
              </Link>
              <Link
                href="/contact"
                className="font-medium transition-colors duration-200 text-gray-600 hover:text-purple-600"
              >
                İletişim
              </Link>

              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="font-medium transition-colors duration-200 text-gray-600 hover:text-purple-600"
                >
                  Kontrol Paneli
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <span className="text-gray-700">
                    Hoş Geldin, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>

            {/* --- Mobil Menü Butonu --- */}
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
          {/* --- Mobil Menü İçeriği --- */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="#home"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                >
                  Anasayfa
                </Link>
                <Link
                  href="/courses"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                >
                  Kurslar
                </Link>
                <Link
                  href="/instructors"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                >
                  Eğitmenler
                </Link>
                <Link
                  href="/about"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                >
                  Hakkımızda
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                >
                  İletişim
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  >
                    Kontrol Paneli
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

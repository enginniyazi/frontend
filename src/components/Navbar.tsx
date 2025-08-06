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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-indigo-600">
          Yowa Academy
        </Link>

        {/* --- Masaüstü Navigasyon --- */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/courses" className="text-gray-600 hover:text-indigo-600">
            Kurslar
          </Link>
          <Link
            href="/instructors"
            className="text-gray-600 hover:text-indigo-600"
          >
            Eğitmenler
          </Link>

          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-indigo-600"
            >
              Kontrol Paneli
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-gray-700">Hoş Geldin, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* --- Mobil Menü Butonu --- */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* --- Mobil Menü İçeriği --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4">
          <Link
            href="/courses"
            className="block text-center py-2 text-gray-700"
          >
            Kurslar
          </Link>
          <Link
            href="/instructors"
            className="block text-center py-2 text-gray-700"
          >
            Eğitmenler
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="block text-center py-2 text-gray-700"
            >
              Kontrol Paneli
            </Link>
          )}
          <hr className="my-4" />
          <div className="flex flex-col items-center space-y-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-gray-700">Hoş Geldin, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white w-3/4 py-2 rounded-md"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-3/4 text-center py-2 rounded-md hover:bg-gray-100"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white w-3/4 text-center py-2 rounded-md"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

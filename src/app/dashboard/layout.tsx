// src/app/dashboard/layout.tsx

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex-grow flex justify-center items-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-20 transform transition-transform duration-300 ease-in-out 
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                   lg:relative lg:translate-x-0 lg:flex-shrink-0`}
      >
        <h2 className="text-xl font-bold mb-6">Kontrol Paneli</h2>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block py-2 px-3 rounded hover:bg-gray-700"
          >
            Panelim
          </Link>
          <Link
            href="/dashboard/my-courses"
            className="block py-2 px-3 rounded hover:bg-gray-700"
          >
            Kurslarım
          </Link>
          <Link
            href="/dashboard/profile"
            className="block py-2 px-3 rounded hover:bg-gray-700"
          >
            Profilim
          </Link>

          {/* {user?.role === "Instructor" && (
            <div className="pt-4 mt-4 border-t border-gray-700">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Eğitmen
              </h3>
              <Link
                href="/dashboard/instructor/courses"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                Kurs Yönetimi
              </Link>
            </div>
          )} */}

          {user?.role === "Admin" && (
            <div className="pt-4 mt-4 border-t border-gray-700">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </h3>
              <Link
                href="/dashboard/users"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                Kullanıcılar
              </Link>
              <Link
                href="/dashboard/courses"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                Tüm Kurslar
              </Link>
              <Link
                href="/dashboard/applications"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                Başvurular
              </Link>
            </div>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="sticky top-0 p-4 bg-white shadow-md lg:hidden flex justify-between items-center z-10">
          <h1 className="text-lg font-bold">Yowa Academy</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
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
                d="M4 6h16M4 12h16m-7 6h4"
              ></path>
            </svg>
          </button>
        </header>
        <main key={pathname} className="p-4 sm:p-6 lg:p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}

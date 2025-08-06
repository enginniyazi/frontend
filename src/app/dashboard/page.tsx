// src/app/dashboard/page.tsx

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Bu sayfa korumalıdır. AuthContext'in kontrolü bitirmesini bekleriz.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Auth durumu kontrol edilirken veya kullanıcı yönlendirilirken bir yükleme ekranı göster.
  if (loading || !isAuthenticated) {
    return <p className="text-center p-8">Yükleniyor...</p>;
  }

  // Her şey yolundaysa, hoş geldin mesajını göster.
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Kontrol Paneline Hoş Geldin, {user?.name}!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Bu alanda sana özel içerikleri ve yönetim araçlarını bulacaksın.
      </p>
      <p className="mt-2">Rolün: <span className="font-semibold text-indigo-600">{user?.role}</span></p>
    </div>
  );
}
// src/app/dashboard/admin/users/page.tsx

"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth(); // Mevcut admin kullanıcısını alıyoruz

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("yowa_token");
      if (!token) throw new Error("Yetkilendirme token'ı bulunamadı.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // TODO: Backend'de tüm kullanıcıları getiren endpoint'i henüz yazmadık.
      // Şimdilik test amaçlı bir şeyler döndürelim veya yazıyı buraya ekleyelim.
      // Geçici olarak tüm kullanıcıları getiren endpoint'i düşünelim: /api/users/all-users
      const res = await fetch(`${apiUrl}/api/auth`, {
        // Şimdilik User Model'den getirme
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Kullanıcılar yüklenemedi.");
      }
      const responseData = await res.json();
      // Backend'den User[] dönmesi lazım. Şimdilik array'i alıyoruz.
      setUsers(responseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "Admin") {
      fetchUsers();
    }
  }, [currentUser]);

  // TODO: Rol değiştirme veya kullanıcı silme gibi fonksiyonlar buraya eklenecek.

  if (loading) return <p>Kullanıcılar yükleniyor...</p>;
  if (error) return <p className="text-red-500">Hata: {error}</p>;
  if (currentUser?.role !== "Admin")
    return <p>Bu sayfaya erişim yetkiniz yok.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Kullanıcı Yönetimi ({users.length})
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                E-posta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* TODO: Rol değiştirme, silme butonları */}
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    Rolü Değiştir
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

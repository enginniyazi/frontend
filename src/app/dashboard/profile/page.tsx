// src/app/dashboard/profile/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import Image from "next/image";

export default function ProfilePage() {
  const { user, loading: authLoading, login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        setAvatarPreview(`${baseUrl}/${user.avatar}`);
      }
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!avatar) {
      setError("Lütfen bir resim seçin.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${apiUrl}/api/auth/profile/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Resim yüklenemedi.");

      if (user && token) {
        const updatedUser: User = { ...user, avatar: data.avatar };
        login({ token, user: updatedUser });
      }

      setSuccess(data.message);
      setAvatar(null); // Yükleme sonrası file input'u temizlemek için
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${apiUrl}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const updatedUserData: User = await res.json();
      if (!res.ok) throw new Error("Profil güncellenemedi.");

      if (token) {
        login({ token, user: updatedUserData });
      }

      setSuccess("Profil bilgileri başarıyla güncellendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p className="text-center p-8">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profilim</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* === AVATAR YÜKLEME FORMU - TAM HALİ === */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Profil Resmi</h2>
            <form onSubmit={handleAvatarSubmit} className="space-y-4">
              <div className="w-32 h-32 rounded-full mx-auto relative overflow-hidden bg-gray-200">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar Önizleme"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Resim Seç
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="avatar-upload" className="sr-only">
                  Avatar Yükle
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !avatar}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                {loading ? "Kaydediliyor..." : "Resmi Kaydet"}
              </button>
            </form>
          </div>
        </div>

        {/* === BİLGİ GÜNCELLEME FORMU - TAM HALİ === */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Kişisel Bilgiler</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ad Soyad
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                {loading ? "Güncelleniyor..." : "Bilgileri Güncelle"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BAŞARI VE HATA MESAJLARI */}
      {error && (
        <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg text-center">
          {success}
        </div>
      )}
    </div>
  );
}

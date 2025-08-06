// src/app/dashboard/instructor/courses/[id]/page.tsx

"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@/types";
import Link from "next/link";
import SectionEditor from "./SectionEditor"; // Yeni bileşenimizi import ediyoruz

export default function CourseManagementPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const fetchCourse = useCallback(async () => {
    // setLoading(true) başa alarak her yenilemede yükleme göstergesi sağlıyoruz
    setLoading(true);
    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Kurs verileri yüklenemedi.");
      setCourse(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  const handleAddSection = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle) return;
    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/courses/${courseId}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newSectionTitle }),
      });
      if (!res.ok) throw new Error("Bölüm eklenemedi.");
      setNewSectionTitle("");
      fetchCourse(); // Listeyi yenilemek için ana fonksiyonu çağır
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hata");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">Hata: {error}</p>;
  if (!course) return <p>Kurs bulunamadı.</p>;

  return (
    <div>
      <button
        onClick={() => router.back()} // Tıklandığında 'geri git' fonksiyonunu çalıştır
        className="text-indigo-600 hover:underline mb-4 inline-block"
      >
        ← Geri Dön
      </button>
      <h1 className="text-3xl font-bold mb-2">
        İçerik Yönetimi: {course.title}
      </h1>
      <p className="text-gray-600 mb-6">
        Bu sayfada kursunuzun bölümlerini ve derslerini yönetebilirsiniz.
      </p>

      {/* Bölümler Listesi - Artık SectionEditor bileşenini kullanıyor */}
      <div className="space-y-4">
        {course.sections.map((section) => (
          <SectionEditor
            key={section._id}
            section={section} // 'section' yerine 'initialSection'
            courseId={course._id}
            onMajorChange={fetchCourse} // 'onContentChange' yerine 'onMajorChange'
          />
        ))}
        {course.sections.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Bu kursta henüz bölüm yok.
          </p>
        )}
      </div>

      {/* Yeni Bölüm Ekleme Formu */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Yeni Bölüm Ekle</h2>
        <form
          onSubmit={handleAddSection}
          className="flex gap-2 bg-white p-4 rounded-lg shadow"
        >
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="Bölüm başlığı"
            className="flex-grow p-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Bölüm Ekle
          </button>
        </form>
      </div>
    </div>
  );
}

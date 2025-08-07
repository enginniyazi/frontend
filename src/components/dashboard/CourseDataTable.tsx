// src/components/dashboard/CourseDataTable.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Course, User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface CourseDataTableProps {
  mode: "my-courses" | "courses"; // Hangi modda çalışacağını belirten prop
}

export default function CourseDataTable({ mode }: CourseDataTableProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Kullanıcı bilgisi
  const currentUser = user; // Kullanıcı bilgisi, modlara göre filtreleme için
  const fetchCourses = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);

    // Mode'a göre doğru API endpoint'ini seçiyoruz
    const endpoint =
      mode === "courses"
        ? "/api/courses/all-courses"
        : "/api/courses/my-courses";

    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Kurslar yüklenemedi.");
      setCourses(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [mode, currentUser]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleTogglePublish = async (
    courseId: string,
    currentStatus: boolean
  ) => {
    if (
      !window.confirm(
        `Bu kursu ${
          currentStatus ? "yayından kaldırmak" : "yayınlamak"
        } istediğinizden emin misiniz?`
      )
    )
      return;
    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${apiUrl}/api/courses/${courseId}/toggle-publish`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c._id === courseId ? { ...c, isPublished: !c.isPublished } : c
        )
      );
      // await fetchCourses(); // Listeyi yenile
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : "Bir hata oluştu."}`);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (
      !window.confirm(
        "Bu kursu kalıcı olarak silmek istediğinizden emin misiniz?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${apiUrl}/api/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Arayüzü anında güncelle
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c._id !== courseId)
      );
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  };
  if (loading) return <p>Kurslar yükleniyor...</p>;
  if (error) return <p className="text-red-500">Hata: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {mode === "my-courses" ? "Kurslarım" : "Tüm Kurslar"}
        </h1>
        {/* "Yeni Kurs Ekle" butonu sadece yetkili rollerde görünmeli */}
        {user && (user.role === "Admin" || user.role === "Instructor") && (
          <Link
            href="/dashboard/courses/new"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Yeni Kurs Ekle
          </Link>
        )}
      </div>
      <div className="hidden lg:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Başlık
              </th>
              {mode === "courses" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Eğitmen
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.title}
                  </td>
                  {mode === "courses" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.instructor.name}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.isPublished ? (
                      <span className="px-2 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Yayında
                      </span>
                    ) : (
                      <span className="px-2 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Taslak
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() =>
                        handleTogglePublish(course._id, course.isPublished)
                      }
                      className={`font-medium w-16 text-sm ${
                        course.isPublished
                          ? "text-yellow-600 hover:text-yellow-700"
                          : "text-green-600 hover:text-green-700"
                      }`}
                    >
                      {course.isPublished ? "Kaldır" : "Yayınla"}
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Sil
                    </button>
                    <Link
                      href={`/dashboard/courses/${course._id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={mode === "courses" ? 4 : 3}
                  className="px-6 py-4 text-center"
                >
                  Gösterilecek kurs bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden space-y-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {course.title}
              </h2>
              <div className="flex items-center justify-between mt-4">
                <div>
                  {course.isPublished ? (
                    <span className="px-2 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Yayında
                    </span>
                  ) : (
                    <span className="px-2 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Taslak
                    </span>
                  )}
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() =>
                      handleTogglePublish(course._id, course.isPublished)
                    }
                    className={`font-medium w-16 text-sm ${
                      course.isPublished
                        ? "text-yellow-600 hover:text-yellow-700"
                        : "text-green-600 hover:text-green-700"
                    }`}
                  >
                    {course.isPublished ? "Kaldır" : "Yayınla"}
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Sil
                  </button>
                  <Link
                    href={`/dashboard/courses/${course._id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <tr>
            <td
              colSpan={mode === "courses" ? 4 : 3}
              className="px-6 py-4 text-center"
            >
              Gösterilecek kurs bulunamadı.
            </td>
          </tr>
        )}
      </div>
    </div>
  );
}

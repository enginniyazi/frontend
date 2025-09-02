// src/app/dashboard/courses/edit/[id]/page.tsx
"use client";
import CourseForm from "@/components/dashboard/CourseForm";
import { Course } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("yowa_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(
            (await res.json()).message || "Kurs verileri yüklenemedi."
          );
        }
        setCourse(await res.json());
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading) return <p>Kurs verileri yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!course) return <p>Kurs bulunamadı.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kursu Düzenle: {course.title}</h1>
      <CourseForm initialData={course} courseId={courseId} />
    </div>
  );
}

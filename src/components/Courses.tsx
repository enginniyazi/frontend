import { Course } from "@/types/course.types";
import React from "react";
import CourseCard from "./CourseCard";
async function getCourses(): Promise<Course[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API_URL not configured");
    const res = await fetch(`${apiUrl}/api/courses`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export default async function Courses() {
  const courses = await getCourses();
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Eğitimler</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yazılım dünyasında kariyerinize yön vermek için en iyi kursları
            keşfedin. Uzman eğitmenlerimizle en güncel teknolojileri öğrenin.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={course._id} course={course} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            Tüm Eğitimleri Gör
          </button>
        </div>
      </div>
    </section>
  );
}

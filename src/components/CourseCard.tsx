// src/components/CourseCard.tsx

import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/types"; // Az önce oluşturduğumuz tipleri kullanıyoruz

interface CourseCardProps {
  course: Course;
  index?: number; // İsteğe bağlı olarak index alabilir
}

export default function CourseCard({ course,index }: CourseCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const coverImageUrl = `${baseUrl}/${course.coverImage}`;
  console.log("Cover Image URL:", coverImageUrl);

  return (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <img
        src={coverImageUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
            {course.categories.map((cat) => cat.name).join(", ")}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(course.sections.length)+4
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold ml-1">{course.title.length}</span>
            <span className="text-gray-500 text-sm ml-1">Yorumlar</span>
          </div>
          <div className="font-bold text-lg">${course.price}</div>
        </div>
      </div>
    </div>
  );
}

// src/components/CourseCard.tsx

import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/types"; // Az önce oluşturduğumuz tipleri kullanıyoruz

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const coverImageUrl = `${baseUrl}/${course.coverImage}`;

  return (
    <Link href={`/courses/${course._id}`} className="group block">
      <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
        <div className="relative w-full h-48 flex-shrink-0">
          <Image
            src={coverImageUrl}
            alt={course.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
        <div className="flex flex-col flex-grow p-4 bg-white">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Eğitmen: {course.instructor.name}
          </p>
          <div className="mt-auto pt-4">
            <p className="text-xl font-extrabold text-indigo-600">
              {course.price.toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

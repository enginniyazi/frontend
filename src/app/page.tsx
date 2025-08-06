// src/app/page.tsx

import type { Course } from "@/types";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";

async function getLatestCourses(): Promise<Course[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Bir kontrol ekleyelim
    if (!apiUrl) {
      throw new Error("API_URL ortam değişkeni bulunamadı.");
    }

    const res = await fetch(`${apiUrl}/api/courses`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error("Failed to fetch courses:", await res.text());
      return [];
    }
    const courses: Course[] = await res.json();
    return courses.slice(0, 6);
  } catch (error) {
    console.error("Error in getLatestCourses:", error);
    return [];
  }
}

export default async function HomePage() {
  const latestCourses = await getLatestCourses();
  return (
    <>
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Yazılım Kariyerinize Yön Verin
          </h1>
          <p className="mt-4 text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto">
            Yowa Academy ile sektörün en güncel teknolojilerini, alanında uzman
            eğitmenlerden öğrenin.
          </p>
          <Link
            href="/courses"
            className="mt-8 inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 text-lg"
          >
            Tüm Kursları İncele
          </Link>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Öne Çıkan Kurslar
          </h2>
          {latestCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Şu anda gösterilecek kurs bulunmamaktadır.
            </p>
          )}
        </div>
      </section>

      {/* Neden Biz? Section (İsteğe Bağlı) */}
      {/* Buraya "Uzman Eğitmenler", "Uygulamalı Projeler" gibi ikonlu bir bölüm eklenebilir. */}
    </>
  );
}

// *   **Teknik Not (`revalidate: 3600`):** Bu, Next.js'in "Incremental Static Regeneration" (ISR) özelliğidir. Anlamı: "Bu sayfanın verilerini ilk build anında çek. Sonra, her saatte bir (3600 saniye), arka planda verileri yeniden çekmeye çalış. Eğer yeni veri varsa, bir sonraki ziyaretçiye güncel sayfayı göster." Bu, sitenizin hem çok hızlı (statik gibi) hem de güncel kalmasını sağlayan inanılmaz güçlü bir özelliktir.

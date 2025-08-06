// src/app/courses/[id]/page.tsx

import type { Course } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";

// TypeScript Notu: Next.js, dinamik sayfa bileşenlerine 'params' adında bir prop geçirir.
// Bu prop'un tipini, içinde 'id' adında bir string olacağını belirterek tanımlıyoruz.
type CourseDetailPageProps = {
  params: {
    id: string;
  };
};

// Veri çeken fonksiyon (Sunucu Bileşeni içinde çalışacak)
async function getCourseDetails(id: string): Promise<Course | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API_URL ortam değişkeni bulunamadı.");


    

    // İSTEK ATILAN URL'İ KONSOLA YAZDIR
    const requestUrl = `${apiUrl}/api/courses/${id}`;
    console.log("İSTEK ATILAN URL:", requestUrl);

    const res = await fetch(`${apiUrl}/api/courses/${id}`, {
      next: { revalidate: 3600 }, // Veriyi 1 saatte bir yeniden doğrula
    });

    if (!res.ok) {
      return null; // Kurs bulunamazsa (404) veya başka bir hata olursa null döndür
    }
    return res.json();
  } catch (error) {
    console.error("Error in getCourseDetails:", error);
    return null; // Fetch hatası olursa null döndür
  }
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const course = await getCourseDetails(params.id);

  // Eğer kurs verisi çekilemezse, Next.js'in standart 404 sayfasını göster.
  if (!course) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const coverImageUrl = `${baseUrl}/${course.coverImage}`;
  console.log(coverImageUrl);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Taraf: Kurs İçeriği */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{course.description}</p>

          {/* Kurs Bölümleri ve Dersleri */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 pb-2">Kurs İçeriği</h2>
            {course.sections.map((section, index) => (
              <div key={section._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3">
                  Bölüm {index + 1}: {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.lectures.map((lecture) => (
                    <li
                      key={lecture._id}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{lecture.title}</span>
                      <span className="text-sm text-gray-500">
                        {lecture.duration} dk
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Taraf: Kurs Bilgi Kartı */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-lg shadow-lg">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={coverImageUrl}
                alt={course.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-4">
              {course.price.toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </div>
            <button className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300">
              Kursa Kayıt Ol
            </button>
            <div className="mt-6 text-sm text-gray-600">
              <p>
                <strong>Eğitmen:</strong> {course.instructor.name}
              </p>
              <p className="mt-2">
                <strong>Kategoriler:</strong>{" "}
                {course.categories.map((cat) => cat.name).join(", ")}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

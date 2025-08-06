// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-red-500">
        404 - Sayfa Bulunamadı
      </h1>
      <p className="mt-4 text-lg">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

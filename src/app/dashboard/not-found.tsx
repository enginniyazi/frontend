// src/app/dashboard/not-found.tsx
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-red-500">Sayfa Bulunamadı</h1>
      <p className="mt-2">
        Aradığınız sayfa bu kontrol panelinde mevcut değil.
      </p>
      <Link href="/dashboard" className="mt-4 text-indigo-600 hover:underline">
        Kontrol Paneline Geri Dön
      </Link>
    </div>
  );
}

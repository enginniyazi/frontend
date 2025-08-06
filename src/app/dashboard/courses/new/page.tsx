// src/app/dashboard/courses/new/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Artık tek bir string değil, seçilen ID'leri tutan bir string dizisi
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/categories`);
        if (!res.ok) throw new Error("Kategoriler yüklenemedi.");
        setAllCategories(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    };
    fetchCategories();
  }, []);

  // Checkbox'lara tıklandığında çalışacak fonksiyon
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      // Eğer kategori zaten seçiliyse, diziden çıkar.
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : // Eğer seçili değilse, diziye ekle.
          [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      setError("Lütfen bir kapak resmi seçin.");
      return;
    }
    console.log("Seçilen Kategoriler:", selectedCategories);
    if (selectedCategories.length === 0) {
      setError("Lütfen en az bir kategori seçin.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("coverImage", coverImage);

    // Dizideki her bir kategori ID'sini, 'categories' anahtarıyla tek tek ekliyoruz.
    // Bu, backend'in (multer/express) bunu bir dizi olarak yorumlamasını sağlar.
    selectedCategories.forEach((catId) => {
      formData.append("categories", catId);
    });
    console.log("Form Data:", Array.from(formData.entries()));

    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${apiUrl}/api/courses`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        console.log("Hata:", data);
        throw new Error(data.message || "Kurs oluşturulamadı.");
      }

      // const newCourse = await res.json();
      router.push(`/dashboard/my-courses`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yeni Kurs Oluştur</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Başlık
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Açıklama
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fiyat
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* === YENİ ÇOKLU KATEGORİ SEÇİM ALANI === */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kategoriler
          </label>
          <div className="mt-2 p-2 border border-gray-300 rounded-md space-y-2 max-h-40 overflow-y-auto">
            {allCategories.length > 0 ? (
              allCategories.map((cat) => (
                <div key={cat._id} className="flex items-center">
                  <input
                    id={`category-${cat._id}`}
                    type="checkbox"
                    checked={selectedCategories.includes(cat._id)}
                    onChange={() => handleCategoryChange(cat._id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`category-${cat._id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {cat.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Yüklenecek kategori bulunamadı.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kapak Resmi
          </label>
          <input
            type="file"
            onChange={(e) =>
              setCoverImage(e.target.files ? e.target.files[0] : null)
            }
            required
            className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? "Oluşturuluyor..." : "Kursu Oluştur"}
        </button>
      </form>
    </div>
  );
}

// src/components/dashboard/CourseForm.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Category, Course } from "@/types";
import Image from "next/image";

interface CourseFormProps {
  initialData?: Course;
  courseId?: string;
}

export default function CourseForm({ initialData, courseId }: CourseFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.coverImage
      ? `${process.env.NEXT_PUBLIC_API_URL}/${initialData.coverImage}`
      : null
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories.map((c) => c._id) || []
  );
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, price: Number(e.target.value) });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEditing && !coverImage) {
      setError("Lütfen bir kapak resmi seçin.");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Lütfen en az bir kategori seçin.");
      return;
    }

    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", String(formData.price));
    selectedCategories.forEach((id) => data.append("categories", id));
    if (coverImage) {
      data.append("coverImage", coverImage);
    }

    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const url = isEditing
        ? `${apiUrl}/api/courses/${courseId}`
        : `${apiUrl}/api/courses`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok)
        throw new Error((await res.json()).message || "İşlem başarısız.");

      router.push("/dashboard/my-courses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-lg shadow-md"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Başlık
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Açıklama
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Fiyat
        </label>
        <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handlePriceChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kategoriler
        </label>
        <div className="mt-2 p-2 border border-gray-300 rounded-md space-y-2 max-h-40 overflow-y-auto">
          {allCategories.map((cat) => (
            <div key={cat._id} className="flex items-center">
              <input
                id={`category-${cat._id}`}
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => handleCategoryChange(cat._id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`category-${cat._id}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kapak Resmi
        </label>
        {imagePreview && (
          <div className="mt-2 relative w-40 h-24">
            <Image
              src={imagePreview}
              alt="Önizleme"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          required={!isEditing}
          className="w-full mt-2 text-sm"
        />
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
      >
        {loading
          ? isEditing
            ? "Güncelleniyor..."
            : "Oluşturuluyor..."
          : isEditing
          ? "Değişiklikleri Kaydet"
          : "Kursu Oluştur"}
      </button>
    </form>
  );
}

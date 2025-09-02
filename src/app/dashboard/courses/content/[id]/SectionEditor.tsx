// src/app/dashboard/instructor/courses/[id]/SectionEditor.tsx

"use client";

import { useState, FormEvent, useEffect } from "react";
import { Course } from "@/types";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

// Tipleri daha spesifik hale getirelim
type Section = Course["sections"][0];
type Lecture = Section["lectures"][0];

// API isteklerini yapmak için merkezi bir fonksiyon (TAM HALİ)
const apiRequest = async (
  url: string,
  method: string,
  token: string | null,
  body?: any
) => {
  if (!token) throw new Error("Token bulunamadı.");
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Bir hata oluştu.");
  }
  return res.json();
};

// --- ANA BİLEŞEN ---
interface SectionEditorProps {
  section: Section;
  courseId: string;
  onMajorChange: () => void; // Sadece büyük değişikliklerde (bölüm silme) çağrılacak
}

export default function SectionEditor({
  section: initialSection,
  courseId,
  onMajorChange,
}: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState<Section>(initialSection);

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [editingTitle, setEditingTitle] = useState(initialSection.title);

  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [newLectureDuration, setNewLectureDuration] = useState(10);

  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  // Prop dışarıdan değişirse (ana sayfa veriyi yeniden çekerse), lokal state'i güncelle
  useEffect(() => {
    setSection(initialSection);
    setEditingTitle(initialSection.title);
  }, [initialSection]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("yowa_token") : null;

  const handleUpdateSection = async () => {
    try {
      const updatedSection = await apiRequest(
        `${apiUrl}/api/courses/${courseId}/sections/${section._id}`,
        "PUT",
        token,
        { title: editingTitle }
      );
      setSection(updatedSection);
      setIsEditingSection(false);
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  };

  const handleDeleteSection = async () => {
    if (
      !window.confirm(
        `"${section.title}" bölümünü silmek istediğinizden emin misiniz?`
      )
    )
      return;
    try {
      await apiRequest(
        `${apiUrl}/api/courses/${courseId}/sections/${section._id}`,
        "DELETE",
        token
      );
      onMajorChange();
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  };

  const handleAddLecture = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newLecture = await apiRequest(
        `${apiUrl}/api/courses/${courseId}/sections/${section._id}/lectures`,
        "POST",
        token,
        { title: newLectureTitle, duration: newLectureDuration }
      );
      setSection((prev) => ({
        ...prev,
        lectures: [...prev.lectures, newLecture],
      }));
      setIsAddingLecture(false);
      setNewLectureTitle("");
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  };

  const handleUpdateLecture = async () => {
    if (!editingLecture) return;
    try {
      const updatedLecture = await apiRequest(
        `${apiUrl}/api/courses/${courseId}/sections/${section._id}/lectures/${editingLecture._id}`,
        "PUT",
        token,
        { title: editingLecture.title, duration: editingLecture.duration }
      );
      setSection((prev) => ({
        ...prev,
        lectures: prev.lectures.map((lec) =>
          lec._id === updatedLecture._id ? updatedLecture : lec
        ),
      }));
      setEditingLecture(null);
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!window.confirm("Bu dersi silmek istediğinizden emin misiniz?")) return;
    try {
      await apiRequest(
        `${apiUrl}/api/courses/${courseId}/sections/${section._id}/lectures/${lectureId}`,
        "DELETE",
        token
      );
      setSection((prev) => ({
        ...prev,
        lectures: prev.lectures.filter((lec) => lec._id !== lectureId),
      }));
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow transition-shadow duration-300 hover:shadow-md">
      <div className="w-full flex justify-between items-center p-4">
        {isEditingSection ? (
          <div className="flex-grow flex gap-2 items-center">
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleUpdateSection}
              className="bg-green-500 text-white px-4 py-2 text-sm rounded-md hover:bg-green-600 transition-colors"
            >
              Kaydet
            </button>
            <button
              onClick={() => {
                setIsEditingSection(false);
                setEditingTitle(section.title);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 text-sm rounded-md hover:bg-gray-300 transition-colors"
            >
              İptal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-grow flex items-center text-left focus:outline-none"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {section.title}
            </h3>
            <ChevronDownIcon
              className={`ml-2 w-5 h-5 text-gray-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
        {!isEditingSection && (
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={() => setIsEditingSection(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Düzenle
            </button>
            <button
              onClick={handleDeleteSection}
              className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              Sil
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <ul className="space-y-2 mb-4">
            {section.lectures.map((lecture) => (
              <li
                key={lecture._id}
                className="p-2 rounded group hover:bg-gray-50"
              >
                {editingLecture?._id === lecture._id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editingLecture.title}
                      onChange={(e) =>
                        setEditingLecture({
                          ...editingLecture,
                          title: e.target.value,
                        })
                      }
                      className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <input
                      type="number"
                      value={editingLecture.duration}
                      onChange={(e) =>
                        setEditingLecture({
                          ...editingLecture,
                          duration: Number(e.target.value),
                        })
                      }
                      className="w-24 p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button
                      onClick={handleUpdateLecture}
                      className="bg-green-500 text-white px-4 py-2 text-sm rounded-md hover:bg-green-600"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setEditingLecture(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 text-sm rounded-md hover:bg-gray-300"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">{lecture.title}</span>
                    <div className="flex items-center space-x-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gray-500">
                        {lecture.duration} dk
                      </span>
                      <button
                        onClick={() => setEditingLecture(lecture)}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteLecture(lecture._id)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
            {section.lectures.length === 0 && (
              <p className="text-sm text-gray-500 pl-2">
                Bu bölümde henüz ders yok.
              </p>
            )}
          </ul>

          {isAddingLecture ? (
            <form
              onSubmit={handleAddLecture}
              className="mt-4 pt-4 border-t border-dashed flex gap-2 items-center"
            >
              <input
                type="text"
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
                placeholder="Yeni ders başlığı"
                className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="number"
                value={newLectureDuration}
                onChange={(e) => setNewLectureDuration(Number(e.target.value))}
                placeholder="Süre (dk)"
                className="w-24 p-2 border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Ekle
              </button>
              <button
                type="button"
                onClick={() => setIsAddingLecture(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                İptal
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingLecture(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mt-2"
            >
              + Yeni Ders Ekle
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// src/app/dashboard/admin/applications/page.tsx

"use client";

import { useState, useEffect } from "react";
import { InstructorApplication } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("yowa_token");
      if (!token) throw new Error("Yetkilendirme token'ı bulunamadı.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/instructors/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Başvurular yüklenemedi.");
      }
      setApplications(await res.json());
    } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchApplications();
    }
  }, [user]);

  const handleReview = async (
    appId: string,
    newStatus: "approved" | "rejected"
  ) => {
    if (
      !window.confirm(
        `Bu başvuruyu "${
          newStatus === "approved" ? "ONAYLAMAK" : "REDDETMEK"
        }" istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("yowa_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(
        `${apiUrl}/api/instructors/applications/${appId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "İşlem gerçekleştirilemedi.");
      }
      // Başarılı olursa, arayüzü en güncel veriyle yenile
      fetchApplications();
    } catch (err) {
      alert(
        `Hata: ${err instanceof Error ? err.message : "Bilinmeyen bir hata"}`
      );
    }
  };

  if (loading) return <p>Başvurular yükleniyor...</p>;
  if (error) return <p className="text-red-500">Hata: {error}</p>;
  if (user?.role !== "Admin") return <p>Bu sayfaya erişim yetkiniz yok.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Eğitmen Başvuruları ({applications.length})
      </h1>
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <p className="text-lg font-semibold">{app.user.name}</p>
                  <p className="text-sm text-gray-600">{app.user.email}</p>
                  <p className="mt-2 text-sm text-gray-800">
                    <b>Bio:</b> {app.bio}
                  </p>
                  <p className="text-sm text-gray-800">
                    <b>Uzmanlık:</b> {app.expertise.join(", ")}
                  </p>
                  <p className="text-sm text-gray-800">
                    <b>Başvuru Tarihi:</b> {app.createdAt}
                  </p>
                  <p className="text-sm text-gray-800">
                    <b>İşlem Tarihi:</b> {app.updatedAt}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0 flex-shrink-0">
                  {app.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleReview(app._id, "approved")}
                        className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReview(app._id, "rejected")}
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                      >
                        Reddet
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status === "approved" ? "Onaylandı" : "Reddedildi"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Gösterilecek yeni başvuru bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
}

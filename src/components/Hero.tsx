import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <section className="pt-36 pb-16 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Yazılım Kariyerinize{" "}
              <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                AI Destekli
              </span>{" "}
              Eğitim ile Yön Verin
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Yowa Academy ile sektörün en güncel teknolojilerini, alanında
              uzman eğitmenlerden AI destekli yöntemlerle öğrenin.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                Öğrenmeye Başla
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-200">
                Ücretsiz Demo Eğitime Katıl
              </button>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">45000+</div>
                <div className="text-sm text-gray-600">Kayıtlı Öğrenci</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">215+</div>
                <div className="text-sm text-gray-600">Kurslar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">97%</div>
                <div className="text-sm text-gray-600">Başarı Oranı</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <img
                src="https://placehold.co/600x400/6366F1/white?text=Öğrenme+Platformu"
                alt="Learning Platform"
                className="w-full rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <img
                src="https://placehold.co/200x150/8B5CF6/white?text=AI+Destekli+Geliştirme"
                alt="AI Analytics"
                className="w-full rounded-lg"
              />
            </div>
            <div className="absolute top-10 -right-6 bg-white rounded-xl shadow-lg p-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <img
                src="https://placehold.co/150x100/d64cb7/white?text=Sektör+Odaklı"
                alt="AI Analytics"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

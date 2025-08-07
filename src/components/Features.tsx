import React from "react";

export default function Features() {
  const features = [
    {
      icon: "🧠",
      title: "AI Destekli Kişisel Öğrenme",
      description:
        "Our intelligent system adapts to your learning style, pace, and preferences, creating a truly personalized educational journey.",
    },
    {
      icon: "📊",
      title: "Gerçek Zamanlı İlerleme Takibi",
      description:
        "Monitor your learning journey with detailed analytics and insights that help you stay on track and achieve your goals.",
    },
    {
      icon: "👥",
      title: "Etkileşimli Topluluk",
      description:
        "Connect with fellow learners, share knowledge, and collaborate on projects in our vibrant learning community.",
    },
    {
      icon: "📱",
      title: "Mobil Öğrenme Deneyimi",
      description:
        "Learn anytime, anywhere with our fully responsive platform that works seamlessly across all devices.",
    },
    {
      icon: "🏆",
      title: "Sertifikalar",
      description:
        "Earn recognized certificates and credentials that validate your skills and enhance your career prospects.",
    },
    {
      icon: "🎧",
      title: "7/24 Destek",
      description:
        "Get help whenever you need it with our dedicated support team available around the clock to assist you.",
    },
  ];
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Modern Bir Eğitim Deneyimi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with proven
            educational methodologies to deliver exceptional learning
            experiences.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

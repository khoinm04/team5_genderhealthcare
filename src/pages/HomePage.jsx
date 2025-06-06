import React, { useState } from "react";
import Header from "../components/Header";
import Services from "../components/Services";
import UserGroups from "../components/userGroups";
import Footer from "../components/Footer";

const slides = [
  {
    id: 1,
    title: "Chăm sóc sức khỏe giới tính toàn diện",
    description:
      "Hỗ trợ bạn theo dõi chu kỳ sinh sản, đặt lịch tư vấn và quản lý dịch vụ y tế dễ dàng.",
    bgImage:
      "url('https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1470&q=80')",
  },
  {
    id: 2,
    title: "Tư vấn và hỗ trợ chuyên nghiệp",
    description:
      "Đội ngũ chuyên gia luôn sẵn sàng tư vấn và đồng hành cùng bạn mọi lúc mọi nơi.",
    bgImage:
      "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1470&q=80')",
  },
  {
    id: 3,
    title: "Dịch vụ đặt lịch dễ dàng",
    description:
      "Đặt lịch nhanh chóng, tiện lợi ngay trên ứng dụng của chúng tôi.",
    bgImage:
      "url('https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1470&q=80')",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const translateX = `-${currentSlide * 100}%`;

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="self-stretch bg-[#ffd6e7] min-h-screen">
        <Header />

        {/* Banner kiểu carousel */}
        <section className="relative w-full h-[512px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(${translateX})` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 w-full h-full relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), ${slide.bgImage}`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative max-w-3xl mx-auto h-full flex flex-col justify-center items-center px-6 text-white drop-shadow-lg">
                  <h1 className="text-5xl font-extrabold mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-lg max-w-lg text-center">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots navigation */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleDotClick(index)}
                aria-label={`Chuyển đến trang ${slide.id}`}
                className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center p-0 text-lg font-semibold transition
        duration-300 ease-in-out
        ${
          currentSlide === index
            ? "bg-white text-[#061178]"
            : "text-white hover:bg-white hover:text-[#061178] hover:shadow-lg hover:scale-110"
        }
      `}
                style={{ userSelect: "none" }}
                type="button"
              >
                {slide.id}
              </button>
            ))}
          </div>
        </section>

        {/* Phần dịch vụ */}
        <section id="services" className="max-w-[960px] mx-auto px-4 py-10">
          <h2 className="text-[#1C0C11] text-4xl font-bold mb-4">Dịch Vụ</h2>
          <Services />
        </section>

        {/* Phần các nhóm xét nghiệm */}
        <section className="max-w-[960px] mx-auto px-4 py-10">
          <h2 className="text-[#1C0C11] text-2xl font-bold mb-4">
            Các nhóm xét nghiệm chăm sóc sức khỏe toàn diện
          </h2>
          <UserGroups />
        </section>
      </div>

      <Footer />
    </div>
  );
}

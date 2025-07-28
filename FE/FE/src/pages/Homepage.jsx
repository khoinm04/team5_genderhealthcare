import React, { useState } from "react";
import Header from "../components/Header";
import Services from "../components/Services";
import UserGroups from "../components/userGroups";
import Footer from "../components/Footer";
import ZaloButton from '../components/ZaloButton';



const slides = [
  {
    id: 1,
    title: "Chăm sóc sức khỏe giới tính toàn diện",
    description:
      "Theo dõi chu kỳ sinh sản và nhận tư vấn y tế ngay trên ứng dụng.",
    bgImage:
      "url('https://media.istockphoto.com/id/1437830105/vi/anh/%E1%BA%A3nh-c%E1%BA%AFt-x%C3%A9n-c%E1%BB%A7a-m%E1%BB%99t-n%E1%BB%AF-y-t%C3%A1-n%E1%BA%AFm-tay-b%E1%BB%87nh-nh%C3%A2n-cao-c%E1%BA%A5p-c%E1%BB%A7a-c%C3%B4-%E1%BA%A5y-h%E1%BB%97-tr%E1%BB%A3-b%C3%A1c-s%C4%A9-gi%C3%BAp-%C4%91%E1%BB%A1-b%E1%BB%87nh-nh%C3%A2n.jpg?s=612x612&w=0&k=20&c=PCXy2LlpWOiUwmMKiXUbPaLcw5hrxo4koQ4RaK_lwhI=')",
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
      "url('https://png.pngtree.com/thumb_back/fh260/background/20240912/pngtree-doctor-holding-clipboard-in-hospital-corridor-medical-stock-photo-image_16150320.jpg')",
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
                onClick={() => handleDotClick(index)}aria-label={`Chuyển đến trang ${slide.id}`}
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
      {/* Zalo Contact Button */}
      <ZaloButton />
    </div>
  );
}
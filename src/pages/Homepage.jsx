import React, { useState } from "react";
import Header from "../components/Header";
import Services from "../components/Services";
import UserGroups from "../components/userGroups";
import Footer from "../components/Footer";


const slides = [
  {
    id: 1,
    title: "Chăm sóc sức khỏe giới tính toàn diện",
    description: "Theo dõi chu kỳ sinh sản và nhận tư vấn y tế chuyên nghiệp từ đội ngũ bác sĩ giàu kinh nghiệm.",
    bgImage: "url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1470&q=80')", // Medical consultation
  },
  {
    id: 2,
    title: "Đội ngũ chuyên gia hàng đầu",
    description: "Bác sĩ chuyên khoa và tư vấn viên tâm lý luôn sẵn sàng đồng hành cùng bạn trong hành trình chăm sóc sức khỏe.",
    bgImage: "url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1470&q=80')", // Healthcare team
  },
  {
    id: 3,
    title: "Công nghệ hiện đại - An toàn tuyệt đối",
    description: "Hệ thống đặt lịch thông minh và bảo mật thông tin tuyệt đối cho trải nghiệm chăm sóc sức khỏe tốt nhất.",
    bgImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1470&q=80')", // Modern healthcare technology
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
      <div className="self-stretch bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
        <Header />

        {/* Banner kiểu carousel */}
        <section className="relative w-full h-[600px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(${translateX})` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 w-full h-full relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), ${slide.bgImage}`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative max-w-4xl mx-auto h-full flex flex-col justify-center items-center px-6 text-white">
                  <h1 className="text-6xl font-extrabold mb-6 text-center leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-xl max-w-2xl text-center leading-relaxed drop-shadow-lg">
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
                className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center p-0 text-lg font-semibold transition-all duration-300 ease-in-out ${currentSlide === index
                    ? "bg-white text-[#061178] shadow-lg"
                    : "text-white hover:bg-white hover:text-[#061178] hover:shadow-lg hover:scale-110"
                  }`}
                style={{ userSelect: "none" }}
                type="button"
              >
                {slide.id}
              </button>
            ))}
          </div>
        </section>

        {/* Phần dịch vụ */}
        <section id="services" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#1C0C11] mb-4">Dịch Vụ</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe giới tính toàn diện với đội ngũ chuyên gia hàng đầu
            </p>
          </div>
          <Services />
        </section>

        {/* Phần các nhóm chăm sóc sức khỏe */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1C0C11] mb-4">
              Các nhóm chăm sóc sức khỏe toàn diện
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tham gia các chương trình chăm sóc sức khỏe chuyên biệt được thiết kế riêng cho từng nhóm đối tượng
            </p>
          </div>
          <UserGroups />
        </section>
      </div>

      <Footer />
    </div>
  );
}
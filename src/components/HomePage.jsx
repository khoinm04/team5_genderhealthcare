import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Services from "./Services";
import UserGroups from "./userGroups";
import Footer from "./Footer";

export default function HomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="self-stretch bg-gray-100 min-h-screen">
        <Header />

        {/* Hero Section */}
        <section
          className="relative w-full h-[512px] flex items-center justify-center text-center px-4"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1470&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative max-w-3xl text-white">
            <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
              Chăm sóc sức khỏe giới tính toàn diện
            </h1>
            <p className="text-lg mb-8 drop-shadow-md">
              Hỗ trợ bạn theo dõi chu kỳ sinh sản, đặt lịch tư vấn và quản lý
              dịch vụ y tế dễ dàng.
            </p>
            <button
              onClick={handleStartClick}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
            >
              Bắt đầu ngay
            </button>
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

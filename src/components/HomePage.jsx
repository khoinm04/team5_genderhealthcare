import React from "react";
import Header from "./Header";
import Services from "./Services";
import BlogList from "./BlogList";

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="self-stretch bg-gray-100 h-auto min-h-screen">
        <Header />

        {/* Banner ảnh lớn full width */}
        <section className="w-full">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/pphwh3dr_expires_30_days.png"
            className="w-full h-[512px] object-cover"
            alt="Main Banner"
          />
        </section>

        {/* Phần dịch vụ */}
        <section className="max-w-[960px] mx-auto px-4 py-10">
          <h2 className="text-[#1C0C11] text-4xl font-bold mb-4">Dịch Vụ</h2>
          <p className="text-[#1C0C11] text-base mb-8">
            Các dịch vụ chính
          </p>
          <Services />
        </section>

        {/* Phần blog */}
        <section className="max-w-[960px] mx-auto px-4 py-10">
          <h2 className="text-[#1C0C11] text-2xl font-bold mb-4">Blog</h2>
          <BlogList />
        </section>
      </div>
    </div>
  );
}

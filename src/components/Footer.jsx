import React from "react";

export default function Footer() {
  return (
<<<<<<< HEAD
    <footer className="bg-[#efdbff] text-[#061178] py-5">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* 1. Logo và mô tả */}
        <div className="max-w-xs flex flex-col">
          <h2 className="h10 font-semibold text-[#061178] mb-4">Gender Health Care</h2>
          <p className="text-[#6b6a7a]">
=======
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      {/* Wrapper chính */}
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between gap-10">

        {/* 1. Logo và mô tả */}
        <div className="max-w-xs flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Gender Health Care</h2>
          <p className="leading-relaxed text-gray-400">
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
            Phần mềm quản lý dịch vụ chăm sóc sức khỏe giới tính - Nâng cao chất lượng chăm sóc sức khỏe cho cộng đồng.
          </p>
        </div>

        {/* 2. Liên kết nhanh */}
<<<<<<< HEAD
        <div className="col-12 col-md-2">
          <h3 className="h10 font-semibold mb-4">Liên kết</h3>
          <ul className="list-unstyled space-y-2">
            <li>
              <a
                href="/"
                className="text-[#3b3a4a] hover:text-pink-500 no-underline hover:no-underline font-medium"
                style={{ textDecoration: "none" }}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="text-[#3b3a4a] hover:text-pink-500 no-underline hover:no-underline font-medium"
                style={{ textDecoration: "none" }}
              >
                Dịch vụ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[#3b3a4a] hover:text-pink-500 no-underline hover:no-underline font-medium"
                style={{ textDecoration: "none" }}
              >
                Liên hệ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[#3b3a4a] hover:text-pink-500 no-underline hover:no-underline font-medium"
                style={{ textDecoration: "none" }}
              >
                Hỗ trợ
              </a>
            </li>
          </ul>
=======
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">Liên kết</h3>
          <a href="/" className="hover:text-pink-500 transition-colors mb-4">Trang chủ</a>
          <a href="/services" className="hover:text-pink-500 transition-colors mb-4">Dịch vụ</a>
          <a href="/contact" className="hover:text-pink-500 transition-colors mb-4">Liên hệ</a>
          <a href="/help" className="hover:text-pink-500 transition-colors">Hỗ trợ</a>
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
        </div>

        {/* 3. Thông tin liên hệ */}
        <div className="max-w-xs flex flex-col">
<<<<<<< HEAD
          <h3 className="h10 font-semibold mb-4">Liên hệ</h3>
          <p>
            Email:{" "}
            <a
              href="mailto:support@genderhealthcare.com"
              className="text-[#3b3a4a] hover:text-pink-500 no-underline hover:no-underline font-medium"
              style={{ textDecoration: "none" }}
            >
              support@genderhealthcare.com
            </a>
          </p>
          <p>
            Hotline:{" "}
            <a
              href="tel:19001234"
              className="text-[#3b3a4a] hover:text-pink-500 no-underline hover:no-underline font-medium"
              style={{ textDecoration: "none" }}
            >
              1900 1234
            </a>
          </p>
        </div>

        {/* 4. Mạng xã hội */}
        <div className="col-12 col-md-2">
          <h3 className="h10 font-semibold mb-4">Mạng xã hội</h3>
          <div className="flex gap-3">
=======
          <h3 className="text-xl font-semibold text-white mb-4">Liên hệ</h3>
          <p className="mb-4">Email: <a href="mailto:support@genderhealthcare.com" className="hover:text-pink-500 transition-colors">support@genderhealthcare.com</a></p>
          <p>Hotline: <a href="tel:19001234" className="hover:text-pink-500 transition-colors">1900 1234</a></p>
        </div>

        {/* 4. Mạng xã hội */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">Mạng xã hội</h3>
          <div className="flex gap-5">
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
<<<<<<< HEAD
              className="no-underline text-[#3b3a4a] hover:text-pink-500 font-medium"
              style={{ textDecoration: "none" }}
            >
              <i className="fab fa-facebook-f fa-lg"></i>
=======
              className="hover:text-pink-500 transition-colors"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.5228-4.477-10-10-10S2 6.4772 2 12c0 4.9915 3.657 9.1289 8.438 9.878v-6.987H7.898v-2.89h2.54v-2.204c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.129 22 16.9915 22 12z" />
              </svg>
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
<<<<<<< HEAD
              className="no-underline text-[#3b3a4a] hover:text-pink-500 font-medium"
              style={{ textDecoration: "none" }}
            >
              <i className="fab fa-twitter fa-lg"></i>
=======
              className="hover:text-pink-500 transition-colors"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.96-2.48 9.05 9.05 0 01-2.85 1.1 4.52 4.52 0 00-7.7 4.12A12.79 12.79 0 013 4.79a4.52 4.52 0 001.4 6.05 4.48 4.48 0 01-2.05-.57v.06a4.53 4.53 0 003.63 4.44 4.48 4.48 0 01-2.04.07 4.53 4.53 0 004.22 3.14A9.06 9.06 0 012 19.54 12.7 12.7 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.53A8.18 8.18 0 0023 3z" />
              </svg>
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
<<<<<<< HEAD
              className="no-underline text-[#3b3a4a] hover:text-pink-500 font-medium"
              style={{ textDecoration: "none" }}
            >
              <i className="fab fa-instagram fa-lg"></i>
=======
              className="hover:text-pink-500 transition-colors"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.25 2.25a.75.75 0 110 1.5.75.75 0 010-1.5zm-4.25 1.75a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
            </a>
          </div>
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Copyright */}
      <div className="max-w-[960px] mx-auto mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm select-none">
        © 2025 Gender Health Care. All rights reserved.
      </div>
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
    </footer>
  );
}

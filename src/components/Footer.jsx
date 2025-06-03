import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#efdbff] text-[#061178] py-5">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* 1. Logo và mô tả */}
        <div className="max-w-xs flex flex-col">
          <h2 className="h5 font-semibold text-[#061178] mb-4">Gender Health Care</h2>
          <p className="text-[#6b6a7a]">
            Phần mềm quản lý dịch vụ chăm sóc sức khỏe giới tính - Nâng cao chất lượng chăm sóc sức khỏe cho cộng đồng.
          </p>
        </div>

        {/* 2. Liên kết nhanh */}
        <div className="col-12 col-md-2">
          <h3 className="h5 font-semibold mb-4">Liên kết</h3>
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
        </div>

        {/* 3. Thông tin liên hệ */}
        <div className="max-w-xs flex flex-col">
          <h3 className="h5 font-semibold mb-4">Liên hệ</h3>
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
          <h3 className="h5 font-semibold mb-4">Mạng xã hội</h3>
          <div className="flex gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="no-underline text-[#3b3a4a] hover:text-pink-500 font-medium"
              style={{ textDecoration: "none" }}
            >
              <i className="fab fa-facebook-f fa-lg"></i>
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="no-underline text-[#3b3a4a] hover:text-pink-500 font-medium"
              style={{ textDecoration: "none" }}
            >
              <i className="fab fa-twitter fa-lg"></i>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="no-underline text-[#3b3a4a] hover:text-pink-500 font-medium"
              style={{ textDecoration: "none" }}
            >
              <i className="fab fa-instagram fa-lg"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t mt-4 pt-4 text-center">
        <small className="text-[#6b6a7a]">
          © 2025 Gender Health Care. All rights reserved.
        </small>
      </div>
    </footer>
  );
}

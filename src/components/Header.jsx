import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/gender-health-care/signingoogle", {
        withCredentials: true,
      })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:8080/gender-health-care/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => setUser(null))
      .catch((err) => console.error("Logout failed", err));
  };

  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Dịch vụ", path: "#services" },
    { name: "Đặt lịch", path: "#services" },
    { name: "Blog", path: "/blog" },
  ];

  const handleScroll = (e, path) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      const id = path.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className="flex items-center self-stretch py-3 px-10"
      style={{ backgroundColor: "#ffd6e7" }}
    >
      <div className="w-4 h-4 mr-4"></div>
      <span
        style={{ color: "#061178", fontFamily: "'Poppins', sans-serif" }}
        className="text-lg font-medium tracking-tight mr-1"
      >
        DỊCH VỤ CHĂM SÓC SỨC KHỎE GIỚI TÍNH
      </span>

      <div className="flex flex-1 justify-between items-center">
        <div className="flex shrink-0 items-center py-[9px] pr-0.5 ml-[326px] gap-[39px]">
          {menuItems.map(({ name, path }) =>
            path.startsWith("#") ? (
              <a
                key={name}
                href={path}
                onClick={(e) => handleScroll(e, path)}
                style={{ color: "#061178", textDecoration: "none" }}
                className="text-sm font-bold cursor-pointer transition-transform transition-colors duration-300 ease-in-out hover:text-pink-600 hover:scale-110"
              >
                {name}
              </a>
            ) : (
              <a
                key={name}
                href={path}
                style={{ color: "#061178", textDecoration: "none" }}
                className="text-sm font-bold transition-transform transition-colors duration-300 ease-in-out hover:text-pink-600 hover:scale-110"
              >
                {name}
              </a>
            )
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <span style={{ color: "#061178" }} className="font-bold">
                {user.name}
              </span>
              <img
                src={user.imageUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <button
                onClick={handleLogout}
                className="bg-green-600 text-white py-2 px-5 rounded-full text-sm font-semibold shadow-md transition duration-300 ease-in-out hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="flex flex-col shrink-0 items-center bg-[#8C66D9] text-white py-[9px] px-8 rounded-xl font-bold no-underline shadow-md transition transform hover:bg-[#734ebf] hover:scale-105 hover:shadow-lg"
                style={{ textDecoration: "none" }}
              >
                Đăng nhập
              </a>
              <a
                href="/register"
                className="flex flex-col shrink-0 items-center bg-[#8C66D9] text-white py-[9px] px-8 rounded-xl font-bold no-underline shadow-md transition transform hover:bg-[#a28fd9] hover:scale-105 hover:shadow-lg"
                style={{ textDecoration: "none" }}
              >
                Đăng ký
              </a>
            </>
          )}
        </div>

        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/xnj4zgzw_expires_30_days.png"
          className="w-10 h-10 object-fill"
          alt="logo"
        />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
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
    <div className="flex items-center self-stretch py-3 px-10 bg-gray-300">
      <div className="w-4 h-4 mr-4"></div>
      <span className="text-[#1C0C11] text-lg font-bold mr-0.5">
        Dịch vụ chăm sóc sức khỏe giới tính
      </span>

      <div className="flex flex-1 justify-between items-center">
        <div className="flex shrink-0 items-center py-[9px] pr-0.5 ml-[326px] gap-[39px]">
          {menuItems.map(({ name, path }) =>
            path.startsWith("#") ? (
              <a
                key={name}
                href={path}
                onClick={(e) => handleScroll(e, path)}
                className="text-[#1C0C11] text-sm font-bold hover:underline cursor-pointer"
              >
                {name}
              </a>
            ) : (
              <a
                key={name}
                href={path}
                className="text-[#1C0C11] text-sm font-bold hover:underline"
              >
                {name}
              </a>
            )
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <span className="font-bold">{user.name}</span>
              <img
                src={user.imageUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
            </>
          ) : (
            <>
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="flex flex-col shrink-0 items-center bg-[#8C66D9] text-white py-[9px] px-8 rounded-xl font-bold no-underline"
              >
                Đăng nhập
              </a>
              <a
                href="/register"
                className="flex flex-col shrink-0 items-center bg-[#C4B4E2] text-[#4B3B72] py-[9px] px-8 rounded-xl font-bold no-underline"
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

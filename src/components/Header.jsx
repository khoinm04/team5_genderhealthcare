import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, ShoppingCart, Heart } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Người dùng",
    email: "",
    imageUrl: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const { token, ...userInfo } = parsedUser;

        if (!token) {
          console.warn("Không có token trong localStorage.");
          return fallbackToSessionStorage();
        }

        setUser(userInfo);

        axios.get("http://localhost:8080/gender-health-care/signingoogle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            const userData = res.data.user;
            localStorage.setItem("user", JSON.stringify({ ...userData, token }));
            sessionStorage.setItem("user", JSON.stringify(userData));
            sessionStorage.setItem("userId", userData.userId.toString());
            setUser(userData);
            setUserInfo(userData);
          })
          .catch((err) => {
            console.error("Token không hợp lệ hoặc đã hết hạn:", err);
            localStorage.removeItem("user");
            fallbackToSessionStorage();
          });

      } catch (e) {
        console.error("Không parse được user từ localStorage:", e);
        fallbackToSessionStorage();
      }
    } else {
      fallbackToSessionStorage();
    }

    function fallbackToSessionStorage() {
      const sessionUser = sessionStorage.getItem("user");
      if (sessionUser) {
        try {
          const parsed = JSON.parse(sessionUser);
          setUser(parsed);
        } catch (e) {
          console.error("Lỗi parse user trong sessionStorage:", e);
          sessionStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    axios.post("http://localhost:8080/gender-health-care/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).finally(() => {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userId");
      window.location.href = "/";
    });
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

  const handleProfileClick = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu') && !event.target.closest('.avatar-wrapper')) {
        setIsProfileVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    navigate("/user-profile");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 lg:px-10 bg-gradient-to-r from-pink-100 to-purple-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <span className="text-[#1C0C11] text-2xl font-bold leading-none">
          Dịch vụ chăm sóc sức khỏe giới tính
        </span>
      </div>

      <nav className="hidden lg:flex items-center gap-10">
        {menuItems.map(({ name, path }) =>
          path.startsWith("#") ? (
            <a
              key={name}
              href={path}
              onClick={(e) => handleScroll(e, path)}
              className="text-black text-xl font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:text-pink-600 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-pink-500 after:transition-all after:duration-300 hover:after:w-full no-underline"
            >
              {name}
            </a>
          ) : (
            <a
              key={name}
              href={path}
              className="text-black text-xl font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:text-pink-600 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-pink-500 after:transition-all after:duration-300 hover:after:w-full no-underline"
            >
              {name}
            </a>
          )
        )}
      </nav>


      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            {/* ✅ NotificationCenter đầu tiên */}
            <NotificationCenter />

            {/* ✅ Avatar và dropdown */}
            <div className="relative avatar-wrapper" onClick={handleProfileClick}>
              {userInfo.imageUrl ? (
                <img
                  src={userInfo.imageUrl}
                  alt="avatar"
                  className="w-12 h-12 rounded-full cursor-pointer border-2 border-pink-200 hover:border-pink-400 transition-colors"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center rounded-full cursor-pointer border-2 border-pink-200 hover:border-pink-400 transition-colors">
                  <User className="w-6 h-6" />
                </div>
              )}

              {/* ✅ Dropdown menu với thông tin user */}
              {isProfileVisible && (
                <div className="absolute top-12 right-0 bg-white shadow-xl rounded-lg w-48 py-2 profile-menu z-50 border border-gray-100">
                  {/* ✅ THÊM thông tin user vào dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-semibold text-sm text-gray-800">{userInfo.name || "Người dùng"}</div>
                    <div className="text-xs text-gray-600">{userInfo.email || ""}</div>
                  </div>

                  <button
                    className="block text-sm text-gray-800 px-4 py-3 hover:bg-gray-50 w-full text-left flex items-center transition-colors"
                    onClick={handleEditProfile}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Hồ sơ
                  </button>
                  <button
                    className="block text-sm text-gray-800 px-4 py-3 hover:bg-gray-50 w-full text-left flex items-center transition-colors"
                    onClick={handleViewOrders}
                  >
                    <ShoppingCart className="w-4 h-4 mr-3" />
                    Đơn đặt lịch
                  </button>

                  {/* ✅ THÊM nút đăng xuất vào dropdown */}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block text-sm text-red-600 px-4 py-3 hover:bg-red-50 w-full text-left flex items-center transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>

        ) : (
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 px-6 rounded-xl font-semibold shadow-md transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg no-underline"
            >
              Đăng nhập
            </a>
            <a
              href="/register"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2.5 px-6 rounded-xl font-semibold shadow-md transition-all duration-300 hover:from-pink-600 hover:to-pink-700 hover:scale-105 hover:shadow-lg no-underline"
            >
              Đăng ký
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

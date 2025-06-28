import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { User } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false); // Điều khiển việc hiển thị profile menu
  const [userInfo, setUserInfo] = useState({
    name: "Người dùng", // Mặc định là Người dùng
    email: "",
    imageUrl: "",
  });

  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng

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
=======
import axios from "axios";


export default function Header() {
  const [user, setUser] = useState(null);

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

      // Đặt user tạm thời, sau đó xác thực lại nếu muốn
      setUser(userInfo);

      // ✅ Gọi lại API xác thực nếu bạn muốn kiểm tra token hoặc cập nhật avatar, name mới nhất
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
          setUser(userData); // Cập nhật user từ backend
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


>>>>>>> 5baec3af8f463cce850f68938b652c2447704054

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

<<<<<<< HEAD
  const handleProfileClick = () => {
    setIsProfileVisible(!isProfileVisible); // Toggle menu profile
  };

  // Đóng menu khi click ra ngoài
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

  // Điều hướng đến trang Chỉnh sửa hồ sơ
  const handleEditProfile = () => {
    navigate("/user-profile");
  };

  // Điều hướng đến trang Đơn Hàng
  const handleViewOrders = () => {
    navigate("/orders");
  };

  return (
    <div className="flex items-center self-stretch py-3 px-10 bg-gray-300"
      style={{ backgroundColor: "#ffd6e7" }}
    >
=======
  return (
    <div className="flex items-center self-stretch py-3 px-10 bg-gray-300">
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
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
<<<<<<< HEAD
                style={{ color: "#061178", textDecoration: "none" }}
                className="text-sm font-bold cursor-pointer transition-transform transition-colors duration-300 ease-in-out hover:text-pink-600 hover:scale-110"
=======
                className="text-[#1C0C11] text-sm font-bold hover:underline cursor-pointer"
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              >
                {name}
              </a>
            ) : (
              <a
                key={name}
                href={path}
<<<<<<< HEAD
                style={{ color: "#061178", textDecoration: "none" }}
                className="text-sm font-bold transition-transform transition-colors duration-300 ease-in-out hover:text-pink-600 hover:scale-110"
=======
                className="text-[#1C0C11] text-sm font-bold hover:underline"
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              >
                {name}
              </a>
            )
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
<<<<<<< HEAD
                <span className="font-bold">{userInfo.name || "Người dùng"}</span>
                <span className="text-xs text-gray-600">{userInfo.email || ""}</span>
              </div>

              <div
                className="relative avatar-wrapper"
                onClick={handleProfileClick}
              >
                {userInfo.imageUrl ? (
                  <img
                    src={userInfo.imageUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-500 text-white flex items-center justify-center rounded-full overflow-hidden">
                    <img src="/image/messi.png" alt="avt" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Hồ Sơ */}
                {isProfileVisible && (
                  <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-40 py-2 profile-menu z-10">
                    <button
                      className="block text-sm text-gray-800 px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center"
                      onClick={handleEditProfile} // Điều hướng đến trang profile
                    >
                      <User className="w-4 h-4 mr-2 inline-block" />
                      Hồ sơ
                    </button>

                    {/* Đơn Hàng */}
                    <button
                      className="block text-sm text-gray-800 px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center"
                      onClick={handleViewOrders} // Điều hướng đến trang Đơn Hàng
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 inline-block" />
                      Đơn đặt lịch
                    </button>
                  </div>
                )}
              </div>

              {/* Logout button */}
=======
                <span className="font-bold">{user.name || "Người dùng"}</span>
                <span className="text-xs text-gray-600">{user.email || ""}</span>
              </div>
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-500 text-white flex items-center justify-center rounded-full overflow-hidden">
                  <img src="/image/messi.png" alt="avt" className="w-full h-full object-cover"/>
                </div>
              )}
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              <button
                onClick={handleLogout}
                className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-sm font-bold hover:bg-green-600"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <a
                href="/login"
<<<<<<< HEAD
                className="flex flex-col shrink-0 items-center bg-[#8C66D9] text-white py-[9px] px-8 rounded-xl font-bold no-underline shadow-md transition transform hover:bg-[#734ebf] hover:scale-105 hover:shadow-lg"
                style={{ textDecoration: "none" }}
=======
                className="flex flex-col shrink-0 items-center bg-[#8C66D9] text-white py-[9px] px-8 rounded-xl font-bold no-underline"
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              >
                Đăng nhập
              </a>
              <a
                href="/register"
<<<<<<< HEAD
                className="flex flex-col shrink-0 items-center bg-[#8C66D9] text-white py-[9px] px-8 rounded-xl font-bold no-underline shadow-md transition transform hover:bg-[#a28fd9] hover:scale-105 hover:shadow-lg"
                style={{ textDecoration: "none" }}
=======
                className="flex flex-col shrink-0 items-center bg-[#C4B4E2] text-[#4B3B72] py-[9px] px-8 rounded-xl font-bold no-underline"
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              >
                Đăng ký
              </a>
            </>
          )}
        </div>
<<<<<<< HEAD
=======

        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/xnj4zgzw_expires_30_days.png"
          className="w-10 h-10 object-fill"
          alt="logo"
        />
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
      </div>
    </div>
  );
}

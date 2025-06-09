import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/gender-health-care/signingoogle", {
      withCredentials: true,
    })
      .then((res) => {
        const userData = res.data.user;
        setUser(userData);

        if (userData && userData.userId !== undefined) {
          sessionStorage.setItem("userId", userData.userId.toString());
          console.log("Stored userId in sessionStorage:", userData.userId);
        }
      })
      .catch((err) => {
        console.error("kiểm tra đăng nhập google thất bại: ", err);
        checkLoginFromSessionStorage();
      });

    function checkLoginFromSessionStorage() {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          setUser(userObj);
        } catch (e) {
          console.error("Lỗi parse user trong sessionStorage:", e);
          setUser(null);
          sessionStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }
    }

  }, []);



  // const handleLogout = () => {
  //   axios.post("http://localhost:8080/gender-health-care/logout", {}, {
  //     withCredentials: true,
  //   })
  //     .then((response) => {
  //       const logoutUrl = response.data.logoutUrl;

  //       // ✅ Nếu là Google Login → chỉ cần redirect, không fetch hay axios
  //       if (logoutUrl) {
  //         // Xóa dữ liệu local trước khi rời đi
  //         sessionStorage.removeItem("userId");
  //         window.location.href = logoutUrl;
  //         return;
  //       }

  //       // ✅ Nếu là login thủ công
  //       sessionStorage.removeItem("user");
  //       window.location.href = "/";
  //     })
  //     .catch((err) => {
  //       console.error("Logout failed", err);
  //     });
  // };

  const handleLogout = () => {
    axios.post("http://localhost:8080/gender-health-care/logout", {}, {
      withCredentials: true,
    })
      .then(() => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userId")
        window.location.href = "/"; // về homepage
      })
      .catch((err) => {
        console.error("Logout failed", err);
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
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
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

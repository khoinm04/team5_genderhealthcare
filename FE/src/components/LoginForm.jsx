import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";



export default function LoginForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = async () => {
    setErrorMessage(""); // reset lỗi cũ

    if (!username.trim() || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/customer/login",
        {
          email: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        setErrorMessage("Không nhận được thông tin người dùng hoặc token.");
        return;
      }

      const userData = {
        ...user,
        token,
      };

      // ✅ Lưu token riêng ra localStorage
      localStorage.setItem("token", token);

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("userId", user.userId.toString());

      if (user.roleName === "Quản trị viên" || user.roleName === "ROLE_ADMIN") {
        navigate("/admin");
      } else if (user.roleName === "Nhân viên" || user.roleName === "ROLE_STAFF") {
        navigate("/staff");
      } else if (user.roleName === "Khách hàng" || user.roleName === "ROLE_CUSTOMER") {
        navigate("/");
      } else if( user.roleName === "Quản lý" || user.roleName === "ROLE_MANAGER") {
        navigate("/manager");
      }
      else {
        setErrorMessage("Không xác định được vai trò người dùng.");
      }

    } catch (error) {
      const message = error.response?.data?.error || "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrorMessage(message);
    }
  };



  return (
    <div className="flex flex-col items-center w-full pt-5 pb-8 max-w-md mx-auto">
      <span className="text-[#1C0C11] text-[32px] font-bold mt-4 mb-6">Xin chào</span>

      <div className="flex flex-col w-full py-3 px-4 gap-2">

      </div>
      <div className="flex flex-col w-full py-3 px-4 gap-2">
        <label htmlFor="username" className="text-[#1C0C11] text-base font-bold">
          Tên đăng nhập hoặc email
        </label>

        <input
          id="username"
          type="text"
          placeholder="Nhập tên đăng nhập hoặc email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-[#FCF7F9] w-full h-10 rounded-xl border border-solid border-[#E8D1D6] px-3"
        />
      </div>

      <div className="flex flex-col w-full py-3 px-4 gap-2 relative">
        <label htmlFor="password" className="text-[#1C0C11] text-base font-bold">
          Mật khẩu
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#FCF7F9] w-full h-10 rounded-xl border border-solid border-[#E8D1D6] px-3 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? (
            // Icon mắt có gạch chéo (ẩn mật khẩu)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7a8.964 8.964 0 013.254-6.638M3 3l18 18"
              />
            </svg>
          ) : (
            // Icon mắt mở (hiện mật khẩu)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm px-4 mt-2">{errorMessage}</p>
      )}
      <span
        className="text-[#964F66] text-sm my-2 cursor-pointer hover:underline"
        onClick={() => navigate("/forgot-password")}
      >
        Quên mật khẩu?
      </span>

      <button
        onClick={handleSubmit}
        className="bg-[#E5195B] w-full max-w-md py-3 rounded-xl text-white font-bold hover:bg-[#c4124a] transition-colors"
      >
        Đăng nhập
      </button>
    </div>
  );
}

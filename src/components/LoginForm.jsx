import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { Eye, EyeOff, Mail, Lock, User, Heart } from 'lucide-react';
import { ArrowLeft } from "lucide-react";


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
      } else if (user.roleName === "Quản lý" || user.roleName === "ROLE_MANAGER") {
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

  const useHome = useNavigate();

  const handleBackToHome = () => {
    useHome("/"); // Điều hướng về trang chủ
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <button
          onClick={handleBackToHome}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-base font-medium">Trang chủ</span>
        </button>
      </div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào!</h1>
        <p className="text-gray-600">Đăng nhập để tiếp tục sử dụng dịch vụ</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập hoặc email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
              <input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập hoặc email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button> */}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-pink-600 text-sm hover:text-pink-700 hover:underline transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 focus:ring-4 focus:ring-pink-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}

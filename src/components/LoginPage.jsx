// LoginPage.jsx
import React from "react";
import LoginForm from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";
import { Link } from "react-router-dom";

export default function LoginPage() {
  // Hàm xử lý đăng nhập giả lập
  function handleLogin(username, password) {
    alert(`Đăng nhập với username: ${username}, mật khẩu: ${password}`);
    // Sau này sẽ gọi API login ở đây
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-gray-300 py-3 px-10 flex items-center">
        <span className="text-[#1C0C11] text-lg font-bold">Dịch vụ chăm sóc sức khỏe giới tính</span>
      </div>

      <div className="flex flex-col items-center flex-grow py-10 px-4">
        <LoginForm onLogin={handleLogin} />
        <SocialLoginButtons />

        <p className="text-[#964F66] text-sm text-center my-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-[#8C66D9] hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
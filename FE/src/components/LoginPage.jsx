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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        
        {/* Social Login */}
        <div className="mt-6">
          <SocialLoginButtons />
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-pink-600 hover:text-pink-700 font-medium underline transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

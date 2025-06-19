import React from "react";

export default function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };
  return (
    <>
      <span className="text-[#964F66] text-sm text-center my-2">
        Hoặc đăng nhập bằng
      </span>
      <div className="flex justify-center py-1">
        <button
          className="flex items-center justify-center bg-white border border-gray-300 text-[#3c4043] font-semibold text-sm rounded-xl px-6 py-2 w-[445px] hover:shadow-md transition-shadow"
          onClick={handleGoogleLogin}
        >
          <img
            src="/image/google-logo.png"
            alt="Google logo"
            className="w-6 h-6 mr-2"
          />
          Đăng nhập bằng Google
        </button>
      </div>
    </>
  );
}
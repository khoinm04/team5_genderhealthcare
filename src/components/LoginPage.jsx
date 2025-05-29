import React from "react";
import LoginForm from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginPage() {
  function handleLogin() {
    alert("Log in pressed!");
  }

  return (
    <div className="flex flex-col justify-endbg-cyan-50">
      <div className="self-stretch bg-gray-200 h-auto min-h-screen  ">
        <div className="self-stretch">
          <div className="flex items-center self-stretch py-3 pl-10 gap-4 bg-gray-300 ">
            <div className="w-4 h-4"></div>
            <span className="text-[#1C0C11] text-lg font-bold mb-[1px]">
              Dịch vụ chăm sóc sức khỏe giới tính
            </span>
          </div>

          <div className="flex flex-col items-center self-stretch py-5">
            <LoginForm onLogin={handleLogin} />
            <SocialLoginButtons />

            <span className="text-[#964F66] text-sm text-center my-1 mx-4">
              Chưa có tài khoản?
            </span>

            <button
              className="flex flex-col items-center bg-[#F2E8EA] pt-3 pb-[13px] px-[200px] my-3 ml-4 rounded-xl text-[#1C0C11] text-base font-bold"
              onClick={() => alert("Sign up pressed!")}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

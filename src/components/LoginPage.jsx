import React from "react";
import LoginForm from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginPage() {
  function handleLogin() {
    alert("Log in pressed!");
  }

  return (
    <div className="flex flex-col justify-end bg-white">
      <div className="self-stretch bg-white h-[833px]">
        <div className="self-stretch bg-[#FCF7F9]">
          <div className="flex items-center self-stretch py-3 pl-10 gap-4">
            <div className="w-4 h-4"></div>
            <span className="text-[#1C0C11] text-lg font-bold mb-[1px]">
              Gender Health Care Services
            </span>
          </div>

          <div className="flex flex-col items-center self-stretch py-5">
            <LoginForm onLogin={handleLogin} />
            <SocialLoginButtons />

            <span className="text-[#964F66] text-sm text-center my-1 mx-4">
              Don't have an account?
            </span>

            <button
              className="flex flex-col items-center bg-[#F2E8EA] pt-3 pb-[13px] px-[210px] my-3 ml-4 rounded-xl text-[#1C0C11] text-base font-bold"
              onClick={() => alert("Sign up pressed!")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function LoginForm({ onLogin }) {
  return (
    <div className="flex flex-col items-start w-[960px] pt-5 pb-[134px]">
      <span className="text-[#1C0C11] text-[32px] font-bold mt-4 mb-[17px] ml-4 mr-11">
        Welcome back!
      </span>

      <div className="flex flex-col items-start py-3 px-4 gap-2">
        <label
          htmlFor="username"
          className="text-[#1C0C11] text-base font-bold mr-[301px]"
        >
          Username or email
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username or email"
          className="bg-[#FCF7F9] w-[448px] h-8 rounded-xl border border-solid border-[#E8D1D6] px-3"
        />
      </div>

      <div className="flex flex-col items-start py-3 px-4 gap-2">
        <label
          htmlFor="password"
          className="text-[#1C0C11] text-base font-bold mr-[374px]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="bg-[#FCF7F9] w-[448px] h-8 rounded-xl border border-solid border-[#E8D1D6] px-3"
        />
      </div>

      <span className="text-[#964F66] text-sm my-1 ml-4 cursor-pointer">
        Forgot password?
      </span>

      <button
        onClick={onLogin}
        className="flex flex-col items-center bg-[#E5195B] pt-3 pb-[13px] px-[216px] my-3 ml-4 rounded-xl text-[#FCF7F9] text-base font-bold"
      >
        Log in
      </button>
    </div>
  );
}

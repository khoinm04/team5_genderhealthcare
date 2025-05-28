import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex items-center self-stretch py-3 px-10 bg-[#FCF7F9]">
      <div className="w-4 h-4 mr-4"></div>
      <span className="text-[#1C0C11] text-lg font-bold mr-0.5">
        Gender Health Care Service
      </span>

      <div className="flex flex-1 justify-between items-start">
        <div className="flex shrink-0 items-start py-[9px] pr-0.5 ml-[326px] gap-[39px]">
          {["Home", "Services", "Booking", "Help"].map((item) => (
            <span key={item} className="text-[#1C0C11] text-sm font-bold">
              {item}
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-start gap-2">
          {/* Dùng Link trực tiếp thay vì button bao quanh */}
          <Link
            to="/login"
            className="flex flex-col shrink-0 items-center bg-[#E5195B] text-white py-[9px] px-[21px] rounded-xl font-bold no-underline"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="flex flex-col shrink-0 items-center bg-[#F2E8EA] text-[#1C0C11] py-[9px] px-4 rounded-xl font-bold no-underline"
          >
            Register
          </Link>
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

// src/components/PillConfirmedToast.jsx
import React from "react";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";

export default function PillConfirmedToast({ pillIndex, pillType }) {
  const timeStr = new Date().toLocaleTimeString();
  const dateStr = new Date().toLocaleDateString("vi-VN");

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-green-600 text-lg font-semibold">
        <FaCheckCircle />
        <span>Đã xác nhận uống thuốc</span>
      </div>
      <div className="mt-1 text-gray-800">
        ✅ Bạn đã uống viên thứ <b>{pillIndex}</b> của vỉ <b>{pillType}</b> viên. Chúc bạn khỏe mạnh!
      </div>
      <div className="mt-1 text-sm flex items-center text-gray-500">
        <FaRegClock className="mr-1" />
        {timeStr} • {dateStr}
      </div>
    </div>
  );
}

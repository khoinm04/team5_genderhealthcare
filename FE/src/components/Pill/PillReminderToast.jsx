// src/components/PillReminderToast.jsx
import React from "react";
import { FaPills, FaRegClock } from "react-icons/fa";

export default function PillReminderToast({ pillIndex, pillType }) {
  const timeStr = new Date().toLocaleTimeString();
  const dateStr = new Date().toLocaleDateString("vi-VN");

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-blue-600 text-lg font-semibold">
        <FaPills />
        <span>Nhắc nhở uống thuốc</span>
      </div>
      <div className="mt-1 text-gray-800">
        ➤ Hãy uống viên thứ <b>{pillIndex}</b> của vỉ <b>{pillType}</b> viên.
      </div>
      <div className="mt-1 text-sm flex items-center text-gray-500">
        <FaRegClock className="mr-1" />
        {timeStr} • {dateStr}
      </div>
    </div>
  );
}

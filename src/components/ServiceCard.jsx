import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

export default function ServiceCard({
  title,
  description,
  icon,
  className = "",
}) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [message, setMessage] = useState("");

  const handleViewDetails = () => {
    if (!user) {
      setMessage("Vui lòng đăng nhập");
      setTimeout(() => setMessage(""), 3000); // 3 giây ẩn thông báo
    } else {
      navigate("/booking");
    }
  };

  return (
    <div
      className={`flex flex-col justify-between cursor-pointer rounded-2xl p-4 text-center shadow-md transition-transform hover:scale-[1.03] hover:shadow-lg ${className}`}
      role="group"
      aria-label={title}
      style={{ minHeight: "280px", backgroundColor: "#f9f0ff" }}
    >
      <div>
        {typeof icon === "string" && icon.length <= 2 ? (
          <div className="mb-4 select-none text-5xl">{icon}</div>
        ) : (
          <img
            src={icon}
            alt={`${title} icon`}
            className="mb-4 h-12 w-12 object-contain"
            loading="lazy"
            draggable={false}
          />
        )}

        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-4 text-gray-600 min-h-[60px] text-sm">{description}</p>
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleViewDetails();
        }}
        className="inline-flex w-full justify-center py-2 font-medium text-indigo-600 hover:text-indigo-800 transition-colors text-sm"
        aria-label={`Tìm hiểu thêm về dịch vụ ${title}`}
      >
        Tìm hiểu thêm
        <svg
          className="ml-2 h-4 w-4 stroke-current transition-colors"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>

      {/* Hiện thông báo lỗi nếu chưa đăng nhập */}
      {message && (
        <div className="mt-2 text-red-600 font-semibold text-sm select-none">
          {message}
        </div>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { Calendar, Phone, TestTube, MessageCircle } from 'lucide-react';

const iconMap = {
  "📅": Calendar,
  "📞": Phone,
  "🧪": TestTube,
  "💬": MessageCircle,
};

const colorMap = {
  "📅": "from-pink-500 to-rose-500",
  "📞": "from-blue-500 to-cyan-500",
  "🧪": "from-purple-500 to-indigo-500",
  "💬": "from-green-500 to-emerald-500",
};

export default function ServiceCard({ title, description, icon, className, navigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  
  const IconComponent = iconMap[icon] || Calendar;
  const colorClass = colorMap[icon] || "from-pink-500 to-rose-500";

  const handleViewDetails = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
    setIsOpen(false);
  };

  const renderModalContent = () => (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1C0C11]">{title}</h2>
      </div>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-700">
          Dịch vụ này sẽ giúp bạn có được sự chăm sóc tốt nhất với đội ngũ chuyên gia giàu kinh nghiệm.
        </p>
      </div>
      <div className="flex gap-3">
        {navigateTo && (
          <button
            onClick={handleConfirm}
            className={`flex-1 bg-gradient-to-r ${colorClass} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            Tiếp Tục
          </button>
        )}
        <button
          onClick={() => setIsOpen(false)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Đóng
        </button>
      </div>
    </>
  );

  return (
    <>
      <div
        className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer h-full flex flex-col ${className}`}
        onClick={handleViewDetails}
      >
        <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-[#1C0C11] mb-3 group-hover:text-pink-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
          {description}
        </p>
        
        <button className={`w-full bg-gradient-to-r ${colorClass} text-white py-3 px-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 mt-auto`}>
          Xem chi tiết
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-lg w-full relative overflow-auto max-h-[80vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
            >
              ✖
            </button>

            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
}
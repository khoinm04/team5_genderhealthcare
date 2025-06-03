import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext"; // cập nhật đường dẫn đúng


export default function ServiceCard({ title, description, icon, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); 

  const handleViewDetails = () => {
    if (!user) {
      navigate("/login");
      return;
    }
     navigate("/booking");
  };

  const renderModalContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p>{description}</p>
      <p>Ở đây bạn có thể thêm các thông tin chi tiết khác như giá, lịch trình, hoặc hình ảnh.</p>
    </>
  );

  return (
    <>
      <div
        className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform cursor-pointer flex flex-col items-center text-center ${className}`}
      >
        {typeof icon === "string" && icon.length <= 2 ? (
          <div className="text-6xl mb-4 select-none">{icon}</div>
        ) : (
          <img src={icon} alt={`${title} icon`} className="w-14 h-14 mb-4 object-contain" />
        )}

        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <button
          className="mt-auto bg-[#E5195B] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#c4124a] transition-colors"
          onClick={handleViewDetails}
        >
          Xem chi tiết
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg mx-4 relative overflow-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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

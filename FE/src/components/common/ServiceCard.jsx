import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD:src/components/common/ServiceCard.jsx
import { useUser } from "../../UserContext";
=======
<<<<<<<< HEAD:src/components/ServiceCard.jsx
import { useUser } from "../UserContext";
import ConsultationBooking from "./ConsultationBooking"; // Import the ConsultationBooking component
========
import { useUser } from "../../UserContext";
>>>>>>>> development:FE/src/components/common/ServiceCard.jsx
>>>>>>> development:FE/src/components/common/ServiceCard.jsx

export default function ServiceCard({ title, description, icon, className, navigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
<<<<<<< HEAD:src/components/common/ServiceCard.jsx
  const { user } = useUser();
=======
<<<<<<<< HEAD:src/components/ServiceCard.jsx
  const { user } = useUser(); 
========
  const { user } = useUser();
>>>>>>>> development:FE/src/components/common/ServiceCard.jsx
>>>>>>> development:FE/src/components/common/ServiceCard.jsx

  const handleViewDetails = () => {
    if (!user) {
      navigate("/login");
      return;
    }
<<<<<<< HEAD:src/components/common/ServiceCard.jsx
=======
<<<<<<<< HEAD:src/components/ServiceCard.jsx
     navigate("/booking");
  };

  const renderModalContent = () => {
    // Special handling for consultation booking service
    if (title === "Đặt lịch tư vấn trực tuyến") {
      return <ConsultationBooking onClose={() => setIsOpen(false)} />;
    }
    
    // Default content for other services
    return (
      <>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p>{description}</p>
        <p>Ở đây bạn có thể thêm các thông tin chi tiết khác như giá, lịch trình, hoặc hình ảnh.</p>
      </>
    );
  };

  // Special modal size for consultation booking
  const getModalClass = () => {
    if (title === "Đặt lịch tư vấn trực tuyến") {
      return "bg-white rounded-lg max-w-5xl mx-4 relative overflow-auto max-h-[90vh] w-full";
    }
    return "bg-white rounded-lg p-6 max-w-lg mx-4 relative overflow-auto max-h-[80vh]";
  };
========
>>>>>>> development:FE/src/components/common/ServiceCard.jsx
    setIsOpen(true); // mở modal, không chuyển trang
  };

  const handleConfirm = () => {
    // Khi người dùng bấm nút xác nhận trong modal, điều hướng đến trang chi tiết
    navigate(navigateTo);
    setIsOpen(false);
  };

  const renderModalContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p>{description}</p>
      <p>Ở đây bạn có thể thêm các thông tin chi tiết khác như giá, lịch trình, hoặc hình ảnh.</p>
      <button
        onClick={handleConfirm}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Đặt lịch dịch vụ
      </button>
    </>
  );
<<<<<<< HEAD:src/components/common/ServiceCard.jsx
=======
>>>>>>>> development:FE/src/components/common/ServiceCard.jsx
>>>>>>> development:FE/src/components/common/ServiceCard.jsx

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
<<<<<<< HEAD:src/components/common/ServiceCard.jsx
          Xem chi tiết
=======
          {title === "Đặt lịch tư vấn trực tuyến" ? "Đặt lịch ngay" : "Xem chi tiết"}
>>>>>>> development:FE/src/components/common/ServiceCard.jsx
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
<<<<<<< HEAD:src/components/common/ServiceCard.jsx
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
=======
            className={getModalClass()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Only show close button for non-consultation booking modals */}
            {title !== "Đặt lịch tư vấn trực tuyến" && (
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
              >
                ✖
              </button>
            )}
>>>>>>> development:FE/src/components/common/ServiceCard.jsx

            {renderModalContent()}
          </div>
        </div>
      )}
    </>
  );
<<<<<<< HEAD:src/components/common/ServiceCard.jsx
}
=======
}
>>>>>>> development:FE/src/components/common/ServiceCard.jsx

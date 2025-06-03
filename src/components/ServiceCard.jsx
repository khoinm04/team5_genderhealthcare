import React, { useState } from "react";

export default function ServiceCard({ title, description, icon, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);

  // Các state cho form chu kỳ sinh sản
  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [result, setResult] = useState(null);

  const handleViewDetails = () => {
    const isLoggedIn = Boolean(localStorage.getItem("userToken"));

    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, mở modal báo yêu cầu đăng nhập
      setLoginRequired(true);
      setIsOpen(true);
      return;
    }
    setLoginRequired(false);
    setIsOpen(true);
  };

  const calculateCycle = () => {
    if (!startDate) {
      alert("Vui lòng nhập ngày bắt đầu kỳ kinh");
      return;
    }
    const start = new Date(startDate);
    const ovulationDate = new Date(start);
    ovulationDate.setDate(start.getDate() + cycleLength - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 2);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 2);

    const periodEnd = new Date(start);
    periodEnd.setDate(start.getDate() + periodLength - 1);

    setResult({
      ovulationDate: ovulationDate.toLocaleDateString(),
      fertileStart: fertileStart.toLocaleDateString(),
      fertileEnd: fertileEnd.toLocaleDateString(),
      periodEnd: periodEnd.toLocaleDateString(),
    });
  };

  const renderModalContent = () => {
    if (loginRequired) {
      return (
        <>
          <h2 className="text-2xl font-bold mb-4">Yêu cầu đăng nhập</h2>
          <p className="text-red-600">Vui lòng đăng nhập để xem chi tiết dịch vụ.</p>
        </>
      );
    }

    if (title === "Theo dõi chu kỳ sinh sản") {
      return (
        <>
          <h2 className="text-2xl font-bold mb-4">{title} - Chi tiết</h2>
          <p className="mb-4">{description}</p>
          <label className="block mb-1 font-semibold">Ngày bắt đầu kỳ kinh</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <label className="block mb-1 font-semibold">Độ dài chu kỳ (ngày)</label>
          <input
            type="number"
            min={20}
            max={45}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <label className="block mb-1 font-semibold">Độ dài hành kinh (ngày)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={periodLength}
            onChange={(e) => setPeriodLength(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <button
            onClick={calculateCycle}
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition mb-4"
          >
            Tính toán
          </button>
          {result && (
            <div className="bg-pink-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Kết quả:</h3>
              <p>Ngày rụng trứng: {result.ovulationDate}</p>
              <p>
                Thời gian khả năng thụ thai cao: từ {result.fertileStart} đến {result.fertileEnd}
              </p>
              <p>Ngày kết thúc hành kinh: {result.periodEnd}</p>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <h2 className="text-2xl font-bold mb-4">{title} - Chi tiết</h2>
        <p>{description}</p>
        <p className="mt-4 italic text-gray-600">Nội dung chi tiết sẽ được cập nhật sau.</p>
      </>
    );
  };

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

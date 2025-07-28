import React, { useState } from 'react';
import { Calendar, Clock, Droplets, Info, Sparkles, History } from 'lucide-react';
import { toast } from "react-toastify"; 

const CycleForm = ({
  cycleData,
  setCycleData,
  handleSaveCycle,
  disabled,
  onSaveToHistory,   
  onShowHistory      
}) => {
  const [errorStartDate, setErrorStartDate] = useState("");

  if (!cycleData) return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent"></div>
        <span className="text-lg text-gray-600 font-medium">Đang tải dữ liệu chu kỳ...</span>
      </div>
    </div>
  );

  // Kiểm tra ngày bắt đầu có phải ngày hôm nay không
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(dateStr);
    picked.setHours(0, 0, 0, 0);
    return picked.getTime() === today.getTime();
  };

  const onSave = (e) => {
    e.preventDefault();
    if (isToday(cycleData.startDate)) {
      setErrorStartDate("Không được chọn ngày bắt đầu chu kỳ là ngày hôm nay!");
      return;
    }
    if (
      !cycleData.cycleLength ||
      cycleData.cycleLength < 25 ||
      cycleData.cycleLength > 45
    ) {
      toast.warning("Độ dài chu kỳ chỉ được phép từ 25 đến 45 ngày!");
      return;
    }
    setErrorStartDate("");
    handleSaveCycle();
  };


  // Xử lý khi lưu vào lịch sử
  const handleSaveHistory = () => {
    if (onSaveToHistory) onSaveToHistory();
  };

  // Xử lý khi xem lịch sử
  const handleShowHistory = () => {
    if (onShowHistory) onShowHistory();
  };

  return (
    <div className="mb-10">
      {/* Tiêu đề và nút Xem lịch sử */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg relative">
            <Calendar className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Thông tin chu kỳ kinh nguyệt</h2>
            <p className="text-gray-600">
              {disabled
                ? "Chu kỳ đã được tính toán. Xem dự đoán trên lịch bên dưới."
                : "Nhập thông tin để dự đoán chu kỳ tiếp theo một cách chính xác"
              }
            </p>
          </div>
        </div>
        {/* Nút Xem lịch sử */}
        <button
          onClick={handleShowHistory}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-pink-300 rounded-xl shadow-sm text-pink-600 font-semibold transition duration-300 ease-in-outhover:bg-pink-100 hover:text-pink-800 hover:shadow-lgactive:scale-95focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1"
          type="button"
        >
          <History className="w-5 h-5" />
          Xem lịch sử
        </button>

      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Ngày bắt đầu chu kỳ */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-pink-500" />
            </div>
            Ngày xảy ra kỳ kinh nguyệt gần nhất:
          </label>
          <input
            type="date"
            value={cycleData.startDate ?? ""}
            onChange={e => {
              setCycleData(prev => ({
                ...prev,
                startDate: e.target.value,
              }));
              setErrorStartDate("");
            }}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-lg"
            disabled={disabled}
            max={new Date().toISOString().split('T')[0]}
          />
          {/* Hiển thị lỗi nếu có */}
          {errorStartDate && (
            <div className="text-red-600 text-sm mt-1">{errorStartDate}</div>
          )}
        </div>

        {/* Độ dài chu kỳ */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            Trung bình độ dài chu kỳ cũ của bạn:
          </label>
          <input
            type="number"
            value={cycleData.cycleLength ?? 28}
            onChange={e =>
              setCycleData(prev => ({
                ...prev,
                cycleLength: parseInt(e.target.value),
              }))
            }
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-lg"
            min="25"
            max="45"
            disabled={disabled}
          />
        </div>

        {/* Độ dài ngày hành kinh */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-red-500" />
            </div>
            Trung bình độ dài ngày hành kinh cũ của bạn:
          </label>
          <input
            type="number"
            value={cycleData.periodDays ?? 5}
            onChange={e =>
              setCycleData(prev => ({
                ...prev,
                periodDays: parseInt(e.target.value),
              }))
            }
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-lg"
            min="3"
            max="10"
            disabled={disabled}
          />
        </div>
      </div>

      {!disabled && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div className="text-blue-800">
              <p className="font-bold mb-3 text-lg">Mẹo để theo dõi chính xác:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Chọn ngày đầu tiên có máu kinh (không phải ngày phát hiện)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Độ dài chu kỳ = trung bình cộng của độ dài chu kỳ trong 6 tháng gần nhất</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Độ dài ngày hành kinh = trung bình độ dài ngày hành kinh của bạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Ghi chú lại để theo dõi sự thay đổi theo thời gian</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Các nút bên dưới */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onSave}
          className={`px-10 py-3 rounded-2xl font-bold text-lg transition-all duration-300 ${disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1'
            }`}
          disabled={disabled}
        >
          {disabled ? (
            <span className="flex items-center gap-3 min-w-[200px] justify-center">
              Đã tính toán chu kỳ
            </span>
          ) : (
            <span className="flex items-center gap-2 min-w-[200px] justify-center">
              Tính toán chu kỳ của tôi
            </span>
          )}
        </button>

      </div>

      {disabled && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Chu kỳ đã được tính toán. Xem dự đoán trên lịch bên dưới.
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleForm;

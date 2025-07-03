import React from 'react';
import { Calendar, Clock, Droplets, Info, Sparkles } from 'lucide-react';

const CycleForm = ({ cycleData, setCycleData, handleSaveCycle, disabled }) => {
  if (!cycleData) return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent"></div>
        <span className="text-lg text-gray-600 font-medium">Đang tải dữ liệu chu kỳ...</span>
      </div>
    </div>
  );

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-8">
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

      <div className="grid md:grid-cols-3 gap-8 mb-8">
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
            onChange={e =>
              setCycleData(prev => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-lg"
            disabled={disabled}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

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
            min="21"
            max="45"
            disabled={disabled}
          />

        </div>

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

      <div className="flex justify-center">
        <button
          onClick={handleSaveCycle}
          className={`px-10 py-3 rounded-2xl font-bold text-lg transition-all duration-300 ${
            disabled 
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
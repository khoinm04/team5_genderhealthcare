import React from 'react';
import { Calendar, Moon, Sun } from 'lucide-react';

const MenstrualCycleInfo = ({ cycle }) => {
  if (!cycle) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Không xác định';
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return '-';
    const targetDate = new Date(dateString);
    const today = new Date();
    if (isNaN(targetDate.getTime())) return '-';
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nextPeriodDays = getDaysUntil(cycle.nextPredictedDate);
  const ovulationDays = getDaysUntil(cycle.predictedOvulationDate);

  // Tính toán cửa sổ sinh sản nếu chưa có, đã có kiểm tra hợp lệ ngày!
  const calculateFertileWindow = () => {
    if (cycle.fertileWindowStart && cycle.fertileWindowEnd) {
      return {
        start: cycle.fertileWindowStart,
        end: cycle.fertileWindowEnd
      };
    }
    const startDate = new Date(cycle.startDate);
    if (!cycle.startDate || isNaN(startDate.getTime()) || !cycle.cycleLength) {
      return { start: '', end: '' };
    }
    const fertileStart = new Date(startDate.getTime() + (cycle.cycleLength - 16) * 24 * 60 * 60 * 1000);
    const fertileEnd = new Date(startDate.getTime() + (cycle.cycleLength - 12) * 24 * 60 * 60 * 1000);
    return {
      start: fertileStart.toISOString().split('T')[0],
      end: fertileEnd.toISOString().split('T')[0]
    };
  };

  const fertileWindow = calculateFertileWindow();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Moon className="text-white" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Chu kỳ hiện tại</h3>
        <p className="text-gray-600 mt-2">Thông tin chi tiết về chu kỳ của bạn</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">Chu kỳ tiếp theo</h4>
            <Calendar className="text-purple-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {typeof nextPeriodDays === 'number'
              ? nextPeriodDays > 0
                ? `${nextPeriodDays} ngày`
                : nextPeriodDays === 0
                ? 'Hôm nay'
                : 'Đã qua'
              : '-'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(cycle.nextPredictedDate)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">Ngày rụng trứng</h4>
            <Sun className="text-orange-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {typeof ovulationDays === 'number'
              ? ovulationDays > 0
                ? `${ovulationDays} ngày`
                : ovulationDays === 0
                ? 'Hôm nay'
                : 'Đã qua'
              : '-'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(cycle.predictedOvulationDate)}
          </p>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Thông tin chi tiết</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày bắt đầu:</span>
              <span className="font-medium">{formatDate(cycle.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày kết thúc:</span>
              <span className="font-medium">{formatDate(cycle.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Độ dài chu kỳ:</span>
              <span className="font-medium">{cycle.cycleLength ? `${cycle.cycleLength} ngày` : 'Không xác định'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian hành kinh:</span>
              <span className="font-medium">{cycle.menstruationDuration ? `${cycle.menstruationDuration} ngày` : 'Không xác định'}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Cửa sổ sinh sản</h4>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Bắt đầu:</span>
              <span className="font-medium">{fertileWindow.start ? formatDate(fertileWindow.start) : 'Không xác định'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kết thúc:</span>
              <span className="font-medium">{fertileWindow.end ? formatDate(fertileWindow.end) : 'Không xác định'}</span>
            </div>
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Lưu ý:</strong> Đây là thời gian khả năng thụ thai cao nhất. 
                Nếu muốn tránh thai, hãy đặc biệt cẩn thận trong giai đoạn này.
              </p>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Lời nhắc sức khỏe</h4>
          <div className="text-sm space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Uống đủ nước (2-3 lít/ngày)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Tập thể dục nhẹ nhàng</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Ăn nhiều rau xanh và trái cây</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Ngủ đủ 7-8 tiếng/đêm</span>
            </div>
          </div>
        </div>

        {cycle.notes && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Ghi chú của bạn</h4>
            <p className="text-gray-700 text-sm italic">"{cycle.notes}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenstrualCycleInfo;

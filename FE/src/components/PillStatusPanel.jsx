import React from 'react';
import { Clock, Pill, Calendar, Target, XCircle,  Timer } from 'lucide-react';

const PillStatusPanel = ({
  pillSchedule,
  pillHistory,
  handleTakePill,
  missedWarning,
  missedStats
}) => {
  if (!pillSchedule) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const startDate = new Date(pillSchedule.startDate);
  startDate.setHours(0, 0, 0, 0);
  const isBeforeStart = today < startDate;
  const hasTakenToday = pillHistory[todayStr] === true;

  const endDate1 = new Date(pillSchedule.endDate);
  const is21Pill = pillSchedule.type === '21';
  const isBreakPeriod = is21Pill && pillSchedule.currentIndex === 20 && today <= endDate1;

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  const getCurrentPillNumber = () => {
    if (isBeforeStart) return 0;
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    return Math.min(daysDiff + 1, parseInt(pillSchedule.type));
  };
  const endDate = new Date(pillSchedule.endDate);
  today.setHours(0, 0, 0, 0);

  const totalPills = parseInt(pillSchedule.type); // 21 hoặc 28
  const hasFinishedAllPills = pillSchedule.currentIndex >= (totalPills === 21 ? 20 : 27);

  const isFinishedPack = today > endDate && hasFinishedAllPills;

  const getTotalTaken = () => {
    return Object.values(pillHistory || {}).filter(x => x === true).length;
  };

  const missedInfo = missedStats || {
    missedDates: [],
    totalMissedDays: 0,
    consecutiveMissedCount: 0,
    maxAllowedMissed: 0,
    pillType: pillSchedule.type,
  };

  const pillType = missedInfo.pillType || pillSchedule.type;

  // Check if late
  const [pillHour, pillMinute] = formatTime(pillSchedule.pillTime).split(':').map(Number);
  const now = new Date();
  const isLate = !isBeforeStart && !hasTakenToday &&
    (now.getHours() > pillHour || (now.getHours() === pillHour && now.getMinutes() > pillMinute));

  const getRiskLevel = () => {
    if (pillType === '21' && missedInfo.totalMissedDays > 0) return 'high';
    if (pillType === '28' && missedInfo.totalMissedDays >= missedInfo.maxAllowedMissed) return 'high';
    if (missedInfo.consecutiveMissedCount >= 2) return 'medium';
    if (missedInfo.totalMissedDays > 0) return 'low';
    return 'safe';
  };



  const riskLevel = getRiskLevel();
  const progressPercentage = Math.round((getTotalTaken() / parseInt(pillSchedule.type)) * 100);

  return (
    <div className="mb-6">
      {/* CẢNH BÁO NGHIÊM TRỌNG */}
      {missedInfo && missedInfo.totalMissedDays > missedInfo.maxAllowedMissed && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">⚠️ Cảnh báo quan trọng!</h3>
              <p className="text-red-700 font-medium mb-3">
                {pillType === '21'
                  ? "Bạn đã quên uống thuốc với vỉ 21 viên. Hiệu quả tránh thai có thể bị giảm."
                  : `Bạn đã quên uống thuốc quá ${missedInfo.maxAllowedMissed} ngày cho phép với vỉ 28 viên.`}
              </p>
              <div className="bg-red-100 p-3 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Khuyến nghị:</strong> Hãy tham khảo ý kiến bác sĩ để được tư vấn cách xử lý phù hợp.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THÔNG TIN CHÍNH */}
      <div>
        {/* Header */}
        <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Lịch uống thuốc</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {today.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {formatTime(pillSchedule.pillTime)}
              </span>
            </div>
            <p className="text-sm text-gray-500">Giờ uống hàng ngày</p>
          </div>
        </div>

        {/* TRẠNG THÁI HÔM NAY */}
        <div className="mb-6">
          <div className={`p-5 rounded-2xl border-2 ${hasTakenToday
            ? 'bg-green-50 border-green-200'
            : isLate
              ? 'bg-orange-50 border-orange-200'
              : 'bg-blue-50 border-blue-200'
            }`}>
            <div className="flex items-center gap-4">
              {hasTakenToday ? (
                <>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-800">Đã uống thuốc hôm nay</h3>
                    <p className="text-green-700">Tuyệt vời! Bạn đang duy trì thói quen tốt</p>
                  </div>
                </>
              ) : isBeforeStart ? (
                <>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">Chuẩn bị bắt đầu</h3>
                    <p className="text-blue-700">
                      Bạn sẽ bắt đầu uống thuốc vào <strong>{startDate.toLocaleDateString('vi-VN')}</strong>
                    </p>
                  </div>
                </>
              ) : isBreakPeriod ? (
                <>
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800">Bạn đang trong 7 ngày nghỉ của vỉ 21</h3>
                    <p className="text-yellow-700">Hãy đợi đến ngày bắt đầu vỉ mới để tiếp tục uống thuốc.</p>
                  </div>
                </>
              ) : isFinishedPack ? (
                <>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Bạn đã uống hết vỉ thuốc</h3>
                    <p className="text-gray-700">Hãy bắt đầu vỉ thuốc mới hoặc tham khảo ý kiến bác sĩ nếu cần.</p>
                  </div>
                </>
              )
                : isLate ? (
                  <>
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold ">Đã trễ giờ uống thuốc!</h3>
                      <p className="text-orange-700">Hãy uống thuốc ngay để đảm bảo hiệu quả</p>
                    </div>
                    <button
                      onClick={handleTakePill}
                      className="min-w-[200px] justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Tôi đã uống thuốc
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-purple-800">Chưa uống thuốc hôm nay</h3>
                      <p className="text-purple-700">Nhớ uống đúng giờ {formatTime(pillSchedule.pillTime)} nhé!</p>
                    </div>
                    <button
                      onClick={handleTakePill}
                      className="min-w-[200px] justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Tôi đã uống thuốc
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>

        {/* THỐNG KÊ TỔNG QUAN */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-1">{getCurrentPillNumber()}</div>
            <div className="text-sm text-gray-600">Viên thứ (hôm nay)</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">{getTotalTaken()}</div>
            <div className="text-sm text-gray-600">Đã uống</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-pink-600 mb-1">
              {pillSchedule?.medicineName ? pillSchedule.medicineName : "Không có tên thuốc"}
            </div>
            <div className="text-sm text-gray-600">Tên thuốc </div>

          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </div>
        </div>

        {/* LỊCH SỬ QUÊN UỐNG */}
        {Array.isArray(missedInfo.missedDates) && missedInfo.missedDates.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Các ngày đã quên gần đây:</h4>
                <div className="flex flex-wrap gap-2">
                  {missedInfo.missedDates.slice(-5).map((date, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                      {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </span>
                  ))}
                  {missedInfo.missedDates.length > 5 && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                      +{missedInfo.missedDates.length - 5} ngày khác
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PillStatusPanel;
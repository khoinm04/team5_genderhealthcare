import React from 'react';
import { Clock, Pill, CheckCircle, AlertTriangle, Calendar, Target, XCircle, Shield, Info, Timer, TrendingUp } from 'lucide-react';

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
          <div className={`p-5 rounded-2xl border-2 ${
            hasTakenToday 
              ? 'bg-green-50 border-green-200' 
              : isLate 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-4">
              {hasTakenToday ? (
                <>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-800">✅ Đã uống thuốc hôm nay</h3>
                    <p className="text-green-700">Tuyệt vời! Bạn đang duy trì thói quen tốt</p>
                  </div>
                </>
              ) : isBeforeStart ? (
                <>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">📅 Chuẩn bị bắt đầu</h3>
                    <p className="text-blue-700">
                      Bạn sẽ bắt đầu uống thuốc vào <strong>{startDate.toLocaleDateString('vi-VN')}</strong>
                    </p>
                  </div>
                </>
              ) : isLate ? (
                <>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-800">⏰ Đã trễ giờ uống thuốc!</h3>
                    <p className="text-orange-700">Hãy uống thuốc ngay để đảm bảo hiệu quả</p>
                  </div>
                  <button
                    onClick={handleTakePill}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Tôi đã uống thuốc
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-800">🎯 Chưa uống thuốc hôm nay</h3>
                    <p className="text-purple-700">Nhớ uống đúng giờ {formatTime(pillSchedule.pillTime)} nhé!</p>
                  </div>
                  <button
                    onClick={handleTakePill}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5" />
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
            <div className="text-3xl font-bold text-red-600 mb-1">{missedInfo.totalMissedDays}</div>
            <div className="text-sm text-gray-600">Đã quên</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </div>
        </div>

        {/* TIẾN ĐỘ CHU KỲ */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Tiến độ chu kỳ</h3>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Đã uống {getTotalTaken()}/{pillSchedule.type} viên</span>
              <span className="text-sm font-semibold text-purple-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* MỨC ĐỘ RỦI RO */}
        {!isBeforeStart && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Mức độ an toàn</h3>
            </div>
            <div className={`p-4 rounded-xl border-2 ${
              riskLevel === 'high' ? 'bg-red-50 border-red-200' :
              riskLevel === 'medium' ? 'bg-orange-50 border-orange-200' :
              riskLevel === 'low' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {riskLevel === 'high' ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : riskLevel === 'medium' ? (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                ) : riskLevel === 'low' ? (
                  <Info className="w-6 h-6 text-yellow-600" />
                ) : (
                  <Shield className="w-6 h-6 text-green-600" />
                )}
                <div>
                  <h4 className={`font-bold text-lg ${
                    riskLevel === 'high' ? 'text-red-800' :
                    riskLevel === 'medium' ? 'text-orange-800' :
                    riskLevel === 'low' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    {riskLevel === 'high' ? '🔴 Rủi ro cao' :
                     riskLevel === 'medium' ? '🟠 Cần chú ý' :
                     riskLevel === 'low' ? '🟡 Hơi có rủi ro' :
                     '🟢 Rất an toàn'}
                  </h4>
                  <p className={`text-sm ${
                    riskLevel === 'high' ? 'text-red-700' :
                    riskLevel === 'medium' ? 'text-orange-700' :
                    riskLevel === 'low' ? 'text-yellow-700' :
                    'text-green-700'
                  }`}>
                    {riskLevel === 'high' ? 'Hiệu quả tránh thai có thể bị giảm đáng kể' :
                     riskLevel === 'medium' ? 'Hãy cố gắng uống thuốc đều đặn hơn' :
                     riskLevel === 'low' ? 'Hãy cố gắng không quên uống thuốc' :
                     'Bạn đang duy trì thói quen uống thuốc rất tốt!'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span>Loại thuốc: <strong>{pillType} viên/chu kỳ</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Quên liên tục: <strong>{missedInfo.consecutiveMissedCount} ngày</strong></span>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>
                    {pillType === '21' 
                      ? <><strong>Quy tắc:</strong> Không được phép quên bất kỳ ngày nào với vỉ 21 viên</>
                      : <><strong>Quy tắc:</strong> Tối đa được quên {missedInfo.maxAllowedMissed} ngày với vỉ 28 viên</>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LỊCH SỬ QUÊN UỐNG */}
        {missedInfo.missedDates.length > 0 && (
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
import React from 'react';
import { Clock, Pill, CheckCircle, AlertTriangle, Calendar, Target, XCircle, TrendingDown, Shield, Info } from 'lucide-react';

const PillStatusPanel = ({
  pillSchedule,
  pillHistory,
  handleTakePill,
  missedWarning,
  missedStats // Dữ liệu trả về từ BE (missed-stats API)
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

  // ----- TỐI ƯU: Dùng trực tiếp missedStats từ BE -----
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

  // Tính toán mức độ rủi ro (nếu muốn cũng nên lấy từ BE, tạm giữ ở FE)
  const getRiskLevel = () => {
    if (pillType === '21' && missedInfo.totalMissedDays > 0) return 'high';
    if (pillType === '28' && missedInfo.totalMissedDays >= missedInfo.maxAllowedMissed) return 'high';
    if (missedInfo.consecutiveMissedCount >= 2) return 'medium';
    if (missedInfo.totalMissedDays > 0) return 'low';
    return 'safe';
  };
  const riskLevel = getRiskLevel();

  return (
    <div className="mb-6">
      {/* ===== ALERT HIỂN THỊ NỔI BẬT KHI QUÁ GIỚI HẠN ===== */}
      {missedInfo && missedInfo.totalMissedDays > missedInfo.maxAllowedMissed && (
        <div className="mb-5 p-4 rounded-xl bg-red-100 border-l-4 border-red-500 flex items-center gap-3 animate-pulse">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <div className="font-bold text-red-700">
              {pillType === '21'
                ? "Bạn đã quên uống thuốc (vỉ 21 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!"
                : "Bạn đã quên uống thuốc quá số ngày cho phép (vỉ 28 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!"}
            </div>
            <div className="text-sm text-red-600 mt-1">
              {pillType === '21'
                ? "Bạn không được phép quên bất kỳ ngày nào với vỉ 21 viên."
                : `Bạn chỉ được quên tối đa ${missedInfo.maxAllowedMissed} ngày với vỉ 28 viên.`}
            </div>
          </div>
        </div>
      )}

      {/* Status Card */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Lịch uống thuốc hôm nay</h3>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {today.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-semibold text-purple-600">
                {formatTime(pillSchedule.pillTime)}
              </span>
            </div>
            <p className="text-sm text-gray-500">Giờ uống thuốc</p>
          </div>
        </div>

        {/* Progress Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/70 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{getCurrentPillNumber()}</div>
            <div className="text-sm text-gray-600">Viên hôm nay</div>
          </div>
          <div className="bg-white/70 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getTotalTaken()}</div>
            <div className="text-sm text-gray-600">Đã uống</div>
          </div>
          <div className="bg-white/70 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{missedInfo.totalMissedDays}</div>
            <div className="text-sm text-gray-600">Đã quên</div>
          </div>
          <div className="bg-white/70 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pillSchedule.type}</div>
            <div className="text-sm text-gray-600">Tổng viên/Chu kỳ</div>
          </div>
        </div>

        {/* Risk Level Indicator */}
        {!isBeforeStart && (
          <div className="mb-6">
            <div className={`p-4 rounded-xl border-2 ${riskLevel === 'high' ? 'bg-red-50 border-red-200' :
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
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                ) : (
                  <Shield className="w-6 h-6 text-green-600" />
                )}
                <div>
                  <h4 className={`font-bold ${riskLevel === 'high' ? 'text-red-800' :
                    riskLevel === 'medium' ? 'text-orange-800' :
                      riskLevel === 'low' ? 'text-yellow-800' :
                        'text-green-800'
                    }`}>
                    {riskLevel === 'high' ? 'Rủi ro cao' :
                      riskLevel === 'medium' ? 'Rủi ro trung bình' :
                        riskLevel === 'low' ? 'Cần chú ý' :
                          'An toàn'}
                  </h4>
                  <p className={`text-sm ${riskLevel === 'high' ? 'text-red-700' :
                    riskLevel === 'medium' ? 'text-orange-700' :
                      riskLevel === 'low' ? 'text-yellow-700' :
                        'text-green-700'
                    }`}>
                    {riskLevel === 'high' ? 'Hiệu quả tránh thai có thể bị giảm' :
                      riskLevel === 'medium' ? 'Cần uống thuốc đều đặn hơn' :
                        riskLevel === 'low' ? 'Hãy cố gắng không quên uống thuốc' :
                          'Bạn đang uống thuốc rất đều đặn'}
                  </p>
                </div>
              </div>

              {/* ======= Detailed Stats: đã sửa nội dung tối đa được quên ======= */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span>Loại thuốc: <strong>{pillType} viên</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>Quên liên tục: <strong>{missedInfo.consecutiveMissedCount} ngày</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>
                    {pillType === '21'
                      ? <b>Không được phép quên ngày nào (vỉ 21 viên)</b>
                      : <>Tối đa được quên: <b>{missedInfo.maxAllowedMissed} ngày (vỉ 28 viên)</b></>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {isBeforeStart && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-800">Chuẩn bị bắt đầu</p>
                <p className="text-sm text-blue-700">
                  Bạn sẽ bắt đầu uống thuốc vào ngày <strong>{startDate.toLocaleDateString('vi-VN')}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {isLate && !missedWarning && (
          <div className="mb-4 p-4 bg-orange-100 border border-orange-300 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-800">Trễ giờ uống thuốc!</p>
                <p className="text-sm text-orange-700">
                  Hãy uống thuốc ngay để đảm bảo hiệu quả tránh thai
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Missed Dates */}
        {missedInfo.missedDates.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800 mb-2">Các ngày đã quên uống thuốc:</p>
                <div className="flex flex-wrap gap-2">
                  {missedInfo.missedDates.slice(-5).map((date, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg">
                      {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </span>
                  ))}
                  {missedInfo.missedDates.length > 5 && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg">
                      +{missedInfo.missedDates.length - 5} ngày khác
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasTakenToday ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold text-green-700">Đã uống thuốc hôm nay</p>
                  <p className="text-sm text-green-600">Tuyệt vời! Hãy duy trì thói quen này</p>
                </div>
              </>
            ) : (
              <>
                <div className={`w-6 h-6 rounded-full border-2 ${isLate ? 'border-orange-500 bg-orange-100' : 'border-purple-500 bg-purple-100'}`}>
                  <Target className={`w-4 h-4 m-0.5 ${isLate ? 'text-orange-500' : 'text-purple-500'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${isLate ? 'text-orange-700' : 'text-purple-700'}`}>
                    {isBeforeStart ? 'Chưa đến ngày bắt đầu' : 'Chưa uống thuốc hôm nay'}
                  </p>
                  <p className={`text-sm ${isLate ? 'text-orange-600' : 'text-purple-600'}`}>
                    {isBeforeStart ? 'Chuẩn bị sẵn sàng cho ngày bắt đầu' : 'Nhớ uống đúng giờ nhé!'}
                  </p>
                </div>
              </>
            )}
          </div>

          {!isBeforeStart && !hasTakenToday && !missedWarning && (
            <button
              onClick={handleTakePill}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <CheckCircle className="w-5 h-5" />
              Tôi đã uống thuốc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PillStatusPanel;

import { Check, Clock, AlertTriangle } from 'lucide-react';

const PillStatusPanel = ({ pillSchedule, pillHistory, handleTakePill, missedWarning }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const startDate = new Date(pillSchedule.startDate);
  startDate.setHours(0, 0, 0, 0);
  const isBeforeStart = today < startDate;

  // Hiển thị giờ 24h (dự phòng)
  let pillTime24 = pillSchedule.time;
  if (pillSchedule.time) {
    const [h, m] = pillSchedule.time.split(':');
    pillTime24 = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  }

  // Trễ giờ uống thuốc hôm nay chưa?
  const [pillHour, pillMinute] = pillTime24.split(':').map(Number);
  const now = new Date();
  const isLate =
    !isBeforeStart &&
    !pillHistory[todayStr] &&
    (
      now.getHours() > pillHour ||
      (now.getHours() === pillHour && now.getMinutes() > pillMinute)
    );

  // Nếu có missedWarning thì disable nút xác nhận uống thuốc hôm nay luôn
  const isButtonDisabled = isBeforeStart || pillHistory[todayStr] === true || !!missedWarning;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Hôm nay: {today.toLocaleDateString('vi-VN')}
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">
            Loại vỉ: <span className="font-semibold">{pillSchedule.type} viên</span>
          </p>
          <p className="text-sm text-gray-600">
            Viên đang uống: <span className="font-semibold">{pillSchedule.currentPill} / {pillSchedule.type}</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Clock className="text-blue-600" size={16} />
            Giờ uống thuốc: <span className="font-semibold text-blue-600">{pillTime24}</span>
          </p>
        </div>
      </div>

      {/* Cảnh báo chưa đến ngày bắt đầu */}
      {isBeforeStart && (
        <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded">
          Bạn sẽ bắt đầu uống thuốc vào ngày <b>{startDate.toLocaleDateString('vi-VN')}</b>.<br />
          Đến ngày này, ứng dụng sẽ nhắc bạn uống thuốc!
        </div>
      )}

      {/* Cảnh báo trễ giờ uống thuốc */}
      {isLate && !missedWarning && (
        <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-400 text-red-800 rounded flex items-center gap-2">
          <Clock className="text-red-500" size={18} />
          <span>⏰ Bạn đã trễ giờ uống thuốc hôm nay! Hãy xác nhận ngay!</span>
        </div>
      )}

      {/* Cảnh báo quên uống thuốc (missed warning) */}
      {missedWarning && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-800 font-bold text-base rounded flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={20} />
          <span>{missedWarning}</span>
        </div>
      )}

      <button
        onClick={handleTakePill}
        disabled={isButtonDisabled}
        className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
          isButtonDisabled
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-green-400 to-blue-400 text-white hover:from-green-500 hover:to-blue-500'
        }`}
      >
        <Check size={18} />
        {isBeforeStart
          ? 'Chưa đến ngày bắt đầu'
          : missedWarning
            ? 'Không thể xác nhận'
            : pillHistory[todayStr] === true
              ? 'Đã uống hôm nay ✓'
              : 'Tôi đã uống hôm nay'
        }
      </button>
    </div>
  );
};

export default PillStatusPanel;

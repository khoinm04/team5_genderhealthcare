import { Check, Clock, AlertTriangle } from 'lucide-react';


const PillStatusPanel = ({ pillSchedule, pillHistory, handleTakePill, missedWarning }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const startDate = new Date(pillSchedule.startDate);
  startDate.setHours(0, 0, 0, 0);
  const isBeforeStart = today < startDate;

  // Hiển thị giờ uống thuốc dạng HH:mm
  let pillTime24 = "00:00";
  if (typeof pillSchedule?.pillTime === "string" && pillSchedule.pillTime.includes(":")) {
    pillTime24 = pillSchedule.pillTime.slice(0, 5);
  }

  // Tổng số viên của vỉ (21 hoặc 28)
  const totalPills = parseInt(pillSchedule.type) || 21;

  // Tính số viên đã uống (ngày nào tick "Đã uống" thì count true)
  const takenCount = Object.values(pillHistory || {}).filter(x => x === true).length;
  // Số viên chưa uống (ngày chưa tick, trong phạm vi từ ngày bắt đầu)
  const missedCount = Object.values(pillHistory || {}).filter(x => x === false).length;
  // Số viên chưa uống nhưng chưa tới ngày (future pills): chỉ hiển thị nếu muốn

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

  // Disable nút nếu chưa đến ngày, đã uống rồi hoặc có cảnh báo
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
            Đã uống: <span className="font-semibold">{takenCount} / {totalPills}</span>
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

      {/* Cảnh báo quên uống thuốc */}
      {missedWarning && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-800 font-bold text-base rounded flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={20} />
          <span>{missedWarning}</span>
        </div>
      )}

      <button
        onClick={handleTakePill}
        disabled={isButtonDisabled}
        className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${isButtonDisabled
          ? 'bg-gray-400 text-white cursor-not-allowed px-3 py-1 rounded-lg text-sm'
          : 'bg-gradient-to-r from-green-400 to-blue-400 text-white hover:from-green-500 hover:to-blue-500 px-3 py-1 rounded-lg text-sm'
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

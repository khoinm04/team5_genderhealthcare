import { ChevronLeft, ChevronRight } from 'lucide-react';

const getPillDayLabel = (status) => {
  switch (status) {
    case 'taken': return 'Đã uống thuốc';
    case 'missed': return 'Quên uống thuốc';
    case 'today': return 'Hôm nay';
    case 'scheduled': return 'Lịch uống thuốc';
    case 'break': return 'Nghỉ';
    default: return '';
  }
};

const PillCalendar = ({ pillCalendarMonth, changePillMonth, getMonthCalendar, getPillDayStatus, hasPillData }) => {
  return (
    <div className="mb-6">
      {/* Tiêu đề lịch + nút chuyển tháng */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <button className="rounded-full hover:bg-gray-100 p-1" onClick={() => changePillMonth(-1)}>
          <ChevronLeft size={20} />
        </button>
        Lịch uống thuốc tháng {pillCalendarMonth.month + 1}/{pillCalendarMonth.year}
        <button className="rounded-full hover:bg-gray-100 p-1" onClick={() => changePillMonth(1)}>
          <ChevronRight size={20} />
        </button>
      </h3>


      {/* Lưới lịch */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 min-w-[560px] mb-4">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 text-sm md:text-base py-1 md:py-2">
              {day}
            </div>
          ))}

          {getMonthCalendar(pillCalendarMonth).map((day, index) => {
            const pillStatus = day
              ? getPillDayStatus(pillCalendarMonth.year, pillCalendarMonth.month, day)
              : null;

            const bgClass = !day
              ? ''
              : pillStatus === 'taken'
                ? 'bg-green-400 text-white'
                : pillStatus === 'missed'
                  ? 'bg-red-400 text-white'
                  : pillStatus === 'today'
                    ? 'bg-blue-300 text-white font-bold'
                    : pillStatus === 'scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : pillStatus === 'break'
                        ? 'bg-gray-200 text-gray-500 italic'
                        : 'bg-gray-100 text-gray-500';

            return (
              <div
                key={index}
                title={day ? getPillDayLabel(pillStatus) : ''}
                className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg border transition-all duration-200 ${bgClass}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chú thích */}
      {hasPillData && (
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs mt-4">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-400 rounded"></div><span>Đã uống thuốc</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-400 rounded"></div><span>Quên uống thuốc</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-300 rounded"></div><span>Hôm nay</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 rounded border"></div><span>Lịch uống thuốc</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded border"></div><span>Nghỉ</span></div>
        </div>
      )}
    </div>
  );
};

export default PillCalendar;

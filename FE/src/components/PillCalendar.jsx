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

const PillCalendar = ({
  pillCalendarMonth,
  changePillMonth,
  getMonthCalendar,
  getPillDayStatus,
  hasPillData
}) => (
  <div className="mb-6 w-full max-w-3xl mx-auto px-2">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <button className="rounded-full hover:bg-gray-100 p-2" onClick={() => changePillMonth(-1)}>
        <ChevronLeft size={22} />
      </button>
      <h3 className="text-2xl font-bold text-gray-800 text-center flex-1 select-none">
        Lịch uống thuốc tháng {pillCalendarMonth.month + 1}/{pillCalendarMonth.year}
      </h3>
      <button className="rounded-full hover:bg-gray-100 p-2" onClick={() => changePillMonth(1)}>
        <ChevronRight size={22} />
      </button>
    </div>

    {/* Calendar Grid */}
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-4 min-w-[680px] md:min-w-0 mb-4">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-base py-2 select-none"
          >
            {day}
          </div>
        ))}

        {getMonthCalendar(pillCalendarMonth).map((day, idx) => {
          const status = day ? getPillDayStatus(pillCalendarMonth.year, pillCalendarMonth.month, day) : null;

          let cls = '';
          if (!day) cls = '';
          else if (status === 'taken') cls = 'bg-green-400 text-white';
          else if (status === 'missed') cls = 'bg-red-400 text-white';
          else if (status === 'today') cls = 'bg-blue-300 text-white font-bold';
          else if (status === 'scheduled') cls = 'bg-blue-100 text-blue-700';
          else if (status === 'break') cls = 'bg-gray-200 text-gray-500 italic';
          else cls = 'bg-gray-100 text-gray-500';

          return (
            <div
              key={idx}
              title={day ? getPillDayLabel(status) : ''}
              className={`w-12 h-12 flex items-center justify-center text-base font-semibold rounded-full border ${cls} mx-auto transition-all shadow-sm`}
              style={{ minWidth: 44, minHeight: 44, maxWidth: 48, maxHeight: 48 }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>

    {/* Chú thích */}
    {hasPillData && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs mt-2 text-gray-700 px-2">
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-400 rounded-full inline-block"></span>Đã uống thuốc</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-300 rounded-full"></span>Hôm nay</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-100 rounded-full border"></span>Lịch uống thuốc</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-200 rounded-full border"></span>Nghỉ</div>
      </div>
    )}
  </div>
);

export default PillCalendar;

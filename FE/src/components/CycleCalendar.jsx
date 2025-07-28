import { ChevronLeft, ChevronRight } from 'lucide-react';

const getDayLabelFromType = (dayType) => {
  switch (dayType) {
    case 'period': return 'Ngày hành kinh';
    case 'pre-ovulation': return 'Giai đoạn trước rụng trứng';
    case 'fertile': return 'Dễ thụ thai cao';
    case 'ovulation': return 'Ngày rụng trứng';
    case 'luteal': return 'Giai đoạn hoàng thể';
    case 'next-period': return 'Kinh nguyệt dự đoán tiếp theo';
    default: return '';
  }
};

const CycleCalendar = ({
  cycleCalendarMonth,
  changeCycleMonth,
  getMonthCalendar,
  getCycleDayType,
  hasCycleData
}) => (
  <div className="mb-6 w-full max-w-3xl mx-auto px-2"> {/* <-- tăng max-w lên */}
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <button className="rounded-full hover:bg-gray-100 p-2" onClick={() => changeCycleMonth(-1)}>
        <ChevronLeft size={22} />
      </button>
      <h3 className="text-2xl font-bold text-gray-800 text-center flex-1 select-none">
        Lịch chu kỳ tháng {cycleCalendarMonth.month + 1}/{cycleCalendarMonth.year}
      </h3>
      <button className="rounded-full hover:bg-gray-100 p-2" onClick={() => changeCycleMonth(1)}>
        <ChevronRight size={22} />
      </button>
    </div>

    {/* Calendar Grid */}
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-4 min-w-[680px] md:min-w-0 mb-4">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-base py-2 select-none"
          >
            {day}
          </div>
        ))}

        {getMonthCalendar(cycleCalendarMonth).map((day, idx) => {
          const dayType = getCycleDayType(cycleCalendarMonth.year, cycleCalendarMonth.month, day);

          let cls = '';
          if (!day) cls = '';
          else if (dayType === 'period') cls = 'bg-rose-500 text-white';
          else if (dayType === 'pre-ovulation') cls = 'bg-yellow-100 text-gray-900';
          else if (dayType === 'fertile') cls = 'bg-yellow-400 text-gray-900';
          else if (dayType === 'ovulation') cls = 'bg-orange-400 text-white';
          else if (dayType === 'luteal') cls = 'bg-blue-200 text-gray-900';
          else if (dayType === 'next-period') cls = 'bg-red-400 text-white';
          else cls = 'bg-gray-100 text-gray-500';

          return (
            <div
              key={idx}
              title={day && dayType !== 'default' ? getDayLabelFromType(dayType) : ''}
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
    {hasCycleData && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs mt-2 text-gray-700 px-2">
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-rose-500 rounded-full inline-block"></span>Ngày kinh nguyệt</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-100 rounded-full border"></span>Trước rụng trứng</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-full"></span>Dễ thụ thai cao</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-orange-400 rounded-full"></span>Ngày rụng trứng</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-200 rounded-full border"></span>Giai đoạn hoàng thể</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-400 rounded-full"></span>Chu kỳ tiếp theo</div>
      </div>
    )}
  </div>
);

export default CycleCalendar;

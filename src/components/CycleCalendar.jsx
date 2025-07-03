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

const CycleCalendar = ({ cycleCalendarMonth, changeCycleMonth, getMonthCalendar, getCycleDayType, hasCycleData }) => (
  <div className="mb-6">
    {/* Tiêu đề lịch + nút chuyển tháng */}
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <button className="rounded-full hover:bg-gray-100 p-1" onClick={() => changeCycleMonth(-1)}>
        <ChevronLeft size={20} />
      </button>
      Lịch chu kỳ tháng&nbsp;
      <span className="text-xl font-semibold text-gray-800">
        {cycleCalendarMonth.month + 1}/{cycleCalendarMonth.year}
      </span>
      <button className="rounded-full hover:bg-gray-100 p-1" onClick={() => changeCycleMonth(1)}>
        <ChevronRight size={20} />
      </button>
    </h3>

    {/* Lưới lịch: 7 cột tương ứng CN–T7 */}
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 min-w-[560px] mb-4">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 text-sm md:text-base py-1 md:py-2">
            {day}
          </div>
        ))}

        {/* Hiển thị từng ngày trong tháng + tô màu theo trạng thái */}
        {getMonthCalendar(cycleCalendarMonth).map((day, index) => {
          const dayType = getCycleDayType(cycleCalendarMonth.year, cycleCalendarMonth.month, day);

          return (
            <div
              key={index}
              title={day && dayType !== 'default' ? getDayLabelFromType(dayType) : ''}
              className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg border transition-all duration-200 ${!day
                ? ''
                : dayType === 'period'
                  ? 'bg-rose-500 text-white'              // 🔴 Kinh nguyệt
                  : dayType === 'pre-ovulation'
                    ? 'bg-yellow-100 text-gray-900'       // 🌕 Trước rụng trứng
                    : dayType === 'fertile'
                      ? 'bg-yellow-400 text-gray-900'     // 🟡 Dễ thụ thai cao
                      : dayType === 'ovulation'
                        ? 'bg-orange-400 text-white'      // 🟠 Ngày rụng trứng
                        : dayType === 'luteal'
                          ? 'bg-blue-200 text-gray-900'   // 🔵 Giai đoạn hoàng thể
                          : dayType === 'next-period'
                            ? 'bg-red-400 text-white'     // 🟥 Kinh nguyệt kế tiếp
                            : 'bg-gray-100 text-gray-500' // ❔ Ngày thường
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>

    {/* Chú thích màu tương ứng với trạng thái */}
    {hasCycleData && (
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-xs mt-4">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-500 rounded"></div><span>Ngày kinh nguyệt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-100 rounded border"></div><span>Trước rụng trứng</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span>Dễ thụ thai cao</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-400 rounded"></div><span>Ngày rụng trứng</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-200 rounded"></div><span>Giai đoạn hoàng thể</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-400 rounded"></div><span>Chu kỳ tiếp theo (dự đoán)</span></div>
      </div>
    )}
  </div>
);

export default CycleCalendar;

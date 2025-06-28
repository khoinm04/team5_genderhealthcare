import { ChevronLeft, ChevronRight } from 'lucide-react';

const CycleCalendar = ({ cycleCalendarMonth, changeCycleMonth, getMonthCalendar, getCycleDayType, hasCycleData }) => (
  <div className="mb-6">
<<<<<<< HEAD
    {/* Tiêu đề lịch + nút chuyển tháng */}
=======
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
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
<<<<<<< HEAD

    {/* Lưới lịch: 7 cột tương ứng CN–T7 */}
=======
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
    <div className="grid grid-cols-7 gap-1 mb-4">
      {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
        <div key={day} className="text-center font-semibold text-gray-600 py-2">{day}</div>
      ))}
<<<<<<< HEAD

      {/* Hiển thị từng ngày trong tháng + tô màu theo trạng thái */}
      {getMonthCalendar(cycleCalendarMonth).map((day, index) => {
        const dayType = getCycleDayType(cycleCalendarMonth.year, cycleCalendarMonth.month, day);

        return (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg border ${
              !day
                ? ''
                : dayType === 'period'
                  ? 'bg-rose-500 text-white'              // 🔴 Ngày kinh nguyệt
                  : dayType === 'ovulation'
                    ? 'bg-emerald-500 text-white'         // 🟢 Ngày rụng trứng
                    : dayType === 'high-fertility'
                      ? 'bg-amber-300 text-gray-900'      // 🟡 Dễ thụ thai cao
                      : dayType === 'medium-fertility'
                        ? 'bg-orange-200 text-gray-900'   // 🟠 Dễ thụ thai trung bình
                        : dayType === 'low-fertility'
                          ? 'bg-violet-200 text-gray-900' // 🟣 Dễ thụ thai thấp
                          : 'bg-gray-100 text-gray-500'   // ❔ Ngày thường (không thuộc chu kỳ)
            }`}
=======
      {getMonthCalendar(cycleCalendarMonth).map((day, index) => {
        const dayType = getCycleDayType(cycleCalendarMonth.year, cycleCalendarMonth.month, day);
        return (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg border ${!day
                ? ''
                : dayType === 'period'
                  ? 'bg-red-400 text-white'                 // Ngày kinh nguyệt: ĐỎ
                  : dayType === 'ovulation'
                    ? 'bg-green-500 text-white'               // Rụng trứng: XANH LÁ
                    : dayType === 'high-fertility'
                      ? 'bg-yellow-300 text-gray-800'           // Dễ thụ thai cao: VÀNG
                      : dayType === 'medium-fertility'
                        ? 'bg-orange-300 text-gray-800'           // Dễ thụ thai vừa: CAM
                        : dayType === 'low-fertility'
                          ? 'bg-purple-200 text-gray-800'           // Dễ thụ thai thấp: TÍM NHẠT
                          : 'bg-gray-100 text-gray-600'             // Ngày thường: XÁM
              }`}
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
          >
            {day}
          </div>
        );
      })}
    </div>
<<<<<<< HEAD

    {/* Chú thích màu tương ứng với trạng thái */}
    {hasCycleData && (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-500 rounded"></div><span> Ngày kinh nguyệt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded"></div><span> Ngày rụng trứng</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-300 rounded"></div><span>Dễ thụ thai cao</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-200 rounded"></div><span> Dễ thụ thai trung bình</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-violet-200 rounded"></div><span> Dễ thụ thai thấp</span></div>
=======
    {hasCycleData && (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-400 rounded"></div><span>🔴 Ngày kinh nguyệt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-400 rounded"></div><span>🟢 Ngày rụng trứng</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-300 rounded"></div><span>🟡 Dễ thụ thai cao</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-300 rounded"></div><span>🟠 Dễ thụ thai trung bình</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-200 rounded"></div><span>🟣 Dễ thụ thai thấp</span></div>
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
      </div>
    )}
  </div>
);
<<<<<<< HEAD

=======
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
export default CycleCalendar;

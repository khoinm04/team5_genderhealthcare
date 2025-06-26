import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

const PillCalendar = ({ pillCalendarMonth, changePillMonth, getMonthCalendar, getPillDayStatus }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <button className="rounded-full hover:bg-gray-100 p-1" onClick={() => changePillMonth(-1)}>
        <ChevronLeft size={20} />
      </button>
      Lịch uống thuốc tháng{' '}
      <span className="text-xl font-semibold text-gray-800">
        {pillCalendarMonth.month + 1}/{pillCalendarMonth.year}
      </span>
      <button className="rounded-full hover:bg-gray-100 p-1" onClick={() => changePillMonth(1)}>
        <ChevronRight size={20} />
      </button>
    </h3>
    <div className="grid grid-cols-7 gap-1 mb-4">
      {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
        <div key={day} className="text-center font-semibold text-gray-600 py-2">
          {day}
        </div>
      ))}
      {getMonthCalendar(pillCalendarMonth).map((day, index) => {
        const pillStatus = getPillDayStatus(
          pillCalendarMonth.year,
          pillCalendarMonth.month,
          day
        );

        // Custom style & icon
        let style = '';
        let icon = null;

        if (!day) {
          style = '';
        } else if (pillStatus === 'taken') {
          style = 'bg-green-500 text-white font-bold text-lg border-2 border-green-700 shadow';
          icon = <Check size={28} className="absolute inset-0 m-auto text-white pointer-events-none" />;
        } else if (pillStatus === 'missed') {
          style = 'bg-red-500 text-white font-bold text-lg border-2 border-red-700 shadow';
          icon = <X size={28} className="absolute inset-0 m-auto text-white pointer-events-none" />;
        } else if (pillStatus === 'today') {
          style = 'bg-blue-200 text-blue-900 ring-2 ring-blue-500 font-semibold';
        } else if (pillStatus === 'scheduled') {
          style = 'bg-blue-50 text-blue-700';
        } else if (pillStatus === 'break') {
          style = 'bg-gray-50 text-gray-400';
        } else {
          style = 'bg-gray-50 text-gray-600';
        }

        return (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center relative rounded-lg border ${style}`}
          >
            {day}
            {icon}
          </div>
        );
      })}
    </div>
    <div className="text-xs text-gray-600">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 border rounded"></div>
          <span>Ngày đã uống thuốc</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 border rounded"></div>
          <span>Ngày quên uống thuốc</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border rounded"></div>
          <span>Lịch uống thuốc</span>
        </div>
      </div>
    </div>
  </div>
);
export default PillCalendar;

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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

const PillCalendar = ({ pillCalendarMonth, changePillMonth, getMonthCalendar, getPillDayStatus, totalPills }) => {
  const monthData = getMonthCalendar(pillCalendarMonth);

  const takenCount = monthData.reduce((acc, day) => {
    if (!day) return acc;
    const status = getPillDayStatus(pillCalendarMonth.year, pillCalendarMonth.month, day);
    return status === 'taken' ? acc + 1 : acc;
  }, 0);

  const missedCount = monthData.reduce((acc, day) => {
    if (!day) return acc;
    const status = getPillDayStatus(pillCalendarMonth.year, pillCalendarMonth.month, day);
    return status === 'missed' ? acc + 1 : acc;
  }, 0);

  const remaining = totalPills - takenCount - missedCount;

  return (
    <motion.div
      key={`${pillCalendarMonth.month}-${pillCalendarMonth.year}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <button 
          className="rounded-full hover:bg-gray-100 p-1" 
          onClick={() => changePillMonth(-1)}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Lịch uống thuốc tháng {pillCalendarMonth.month + 1}/{pillCalendarMonth.year}
          </h3>
        </div>
        <button 
          className="rounded-full hover:bg-gray-100 p-1" 
          onClick={() => changePillMonth(1)}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 min-w-[560px] mb-4">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 text-sm md:text-base py-1 md:py-2">
              {day}
            </div>
          ))}

          {monthData.map((day, index) => {
            const pillStatus = day
              ? getPillDayStatus(pillCalendarMonth.year, pillCalendarMonth.month, day)
              : null;

            let bgClass = 'bg-gray-100 text-gray-500';
            if (pillStatus === 'taken') bgClass = 'bg-green-400 text-white';
            else if (pillStatus === 'missed') bgClass = 'bg-red-400 text-white';
            else if (pillStatus === 'today') bgClass = 'bg-blue-300 text-white font-bold';
            else if (pillStatus === 'scheduled') bgClass = 'bg-blue-100 text-blue-700';
            else if (pillStatus === 'break') bgClass = 'bg-gray-200 text-gray-500 italic';

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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 text-xs mt-4">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-400 rounded"></div><span>Đã uống thuốc</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-400 rounded"></div><span>Quên uống thuốc</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-300 rounded"></div><span>Hôm nay</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 rounded border"></div><span>Lịch uống thuốc</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded border"></div><span>Nghỉ</span></div>
      </div>
    </motion.div>
  );
};

export default PillCalendar;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Hàm parse ngày chuẩn, không bị lệch múi giờ
function parseLocalDate(str) {
  // str dạng "YYYY-MM-DD"
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Lấy tất cả ngày hành kinh trong 1 chu kỳ
const getPeriodDays = (startDate, menstruationDuration) => {
  const arr = [];
  let d = parseLocalDate(startDate);
  for (let i = 0; i < menstruationDuration; i++) {
    arr.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return arr;
};

const CycleHistoryCalendar = ({ historyList, onClose }) => {
  // Lấy tháng/năm hiện tại
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });

  // Tính các ngày cần hiển thị trong tháng
  const getMonthCalendar = ({ year, month }) => {
    const firstDay = new Date(year, month, 1);
    const days = [];
    // Bắt đầu từ chủ nhật đầu tiên của tháng
    let startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Set các ngày theo type
  const periodDaysSet = new Set();
  historyList.forEach(cycle => {
    const arr = getPeriodDays(cycle.startDate, cycle.menstruationDuration);
    arr.forEach(d => periodDaysSet.add(d.toISOString().slice(0, 10)));
  });

  const startDaysSet = new Set(historyList.map(cycle => parseLocalDate(cycle.startDate).toISOString().slice(0, 10)));
  const endDaysSet = new Set(historyList.map(cycle => parseLocalDate(cycle.endDate).toISOString().slice(0, 10)));

  // Chuyển tháng
  const changeMonth = (amount) => {
    setCalendarMonth(prev => {
      let month = prev.month + amount;
      let year = prev.year;
      if (month < 0) { month = 11; year--; }
      if (month > 11) { month = 0; year++; }
      return { year, month };
    });
  };

  const days = getMonthCalendar(calendarMonth);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {/* Tiêu đề */}
        <div className="flex items-center justify-between mb-4">
          <button className="rounded-full hover:bg-gray-100 p-2" onClick={() => changeMonth(-1)}>
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl font-bold text-gray-800">
            Tháng {calendarMonth.month + 1}/{calendarMonth.year}
          </h3>
          <button className="rounded-full hover:bg-gray-100 p-2" onClick={() => changeMonth(1)}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Lưới lịch */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[420px]">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d =>
              <div key={d} className="text-center font-semibold text-gray-500 text-sm py-1">{d}</div>
            )}
            {days.map((date, idx) => {
              const dayStr = date.toISOString().slice(0, 10);
              const inMonth = date.getMonth() === calendarMonth.month;

              // Ưu tiên: bắt đầu > kết thúc > hành kinh
              let cls = "bg-white text-gray-600 border";
              if (startDaysSet.has(dayStr)) {
                cls = "bg-rose-500 text-white font-bold border-emerald-600 border-2";
              } else if (endDaysSet.has(dayStr)) {
                cls = "bg-blue-400 text-white font-bold border-blue-600 border-2";
              } else if (periodDaysSet.has(dayStr)) {
                cls = "bg-rose-500 text-white border border-rose-500";
              }
              if (!inMonth) cls += " opacity-30";

              return (
                <div
                  key={idx}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium mx-auto transition-all ${cls}`}
                  style={{ minWidth: 32, minHeight: 32, maxWidth: 38, maxHeight: 38 }}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
        {/* Chú thích */}
        <div className="mt-4 flex gap-4 text-xs text-gray-700 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-emerald-400 border-2 border-emerald-600 rounded-full inline-block"></span>
            Ngày bắt đầu chu kỳ
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-blue-400 border-2 border-blue-600 rounded-full inline-block"></span>
            Ngày kết thúc chu kỳ
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-rose-500 border border-rose-500 rounded-full inline-block"></span>
            Ngày hành kinh
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleHistoryCalendar;

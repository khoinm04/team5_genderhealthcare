// Chu kì kinh nguyệt
export const mockCycleData = {
  startDate: '2025-06-01',
  cycleLength: 28,
  periodDays: 5,
};


// Thuốc
// export const mockPillSchedule = {
//   type: '28',
//   startDate: '2025-06-01',
//   time: '08:00',
//   currentPill: 8,
// };

export const mockPillHistory = {
  '2025-06-01': false,
  '2025-06-02': false,
  '2025-06-03': true,
  '2025-06-04': false,
  '2025-06-05': true,
};

export const mockPillSchedule = {
  id: 1,
  userId: 99,
  type: "21", // hoặc "28"
  startDate: "2025-06-10",
  pillTime: "07:00:00",
  currentIndex: 10, // đang đến viên thứ 11 (tính từ 0)
  isActive: true,
  breakUntil: null
};




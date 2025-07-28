// Chu kỳ kinh nguyệt - Test nhiều trường hợp
export const mockCycleData = {
  startDate: '2025-07-01',
  endDate: '2025-07-28',
  cycleLength: 28,
  menstruationDuration: 6,
  predictedOvulationDate: '2025-07-14',
  predictedFertileWindowStartDate: '2025-07-10',
  predictedFertileWindowEndDate: '2025-07-15',
  nextPredictedDate: '2025-07-29',
  notes: 'Chu kỳ đều, không đau bụng.'
};

// Lịch uống thuốc: thử loại 28 viên (test cả vỉ dài và lịch nhiều ngày)
export const mockPillSchedule = {
  id: 101,
  userId: 1,
  type: "28",               // Vỉ 28 viên
  startDate: "2025-06-01",  // Ngày bắt đầu
  pillTime: "08:00:00",
  currentIndex: 15,
  isActive: true,
  breakUntil: null
};

// Lịch sử uống thuốc: 15 ngày đầu đã uống và quên, còn lại chưa đến
export const mockPillHistory = {
  '2025-06-01': true,
  '2025-06-02': true,
  '2025-06-03': false, // ❌ Quên
  '2025-06-04': true,
  '2025-06-05': false, // ❌ Quên
  '2025-06-06': true,
  '2025-06-07': true,
  '2025-06-08': true,
  '2025-06-09': true,
  '2025-06-10': false, // ❌ Quên
  '2025-06-11': true,
  '2025-06-12': true,
  '2025-06-13': true,
  '2025-06-14': true,
  '2025-06-15': true,
  '2025-06-16': false, // ❌ Quên hôm nay để hiển thị "quên"
  '2025-06-17': true,
  '2025-06-18': true,
  '2025-06-19': false,
  '2025-06-20': true
  // Các ngày sau chưa tới sẽ được đánh dấu là scheduled
};

// Thống kê quên thuốc từ backend giả
export const mockMissedStats = {
  missedDates: ['2025-07-03', '2025-07-05', '2025-07-10', '2025-07-16', '2025-07-19'],
  totalMissedDays: 5,
  consecutiveMissedCount: 2,     // để hiển thị cảnh báo rủi ro
  maxAllowedMissed: 2,           // với vỉ 28 viên
  pillType: "28"
};

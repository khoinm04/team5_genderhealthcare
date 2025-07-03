// Chu kỳ kinh nguyệt - Test nhiều trường hợp
export const mockCycleData = {
  startDate: '2025-07-01',                 // Ngày bắt đầu kỳ hành kinh hiện tại (đổi sang tháng 7 cho dễ test)
  endDate: '2025-07-28',                   // Ngày kết thúc chu kỳ hiện tại
  cycleLength: 28,                         // Chu kỳ dài 28 ngày
  menstruationDuration: 5,                 // Số ngày hành kinh
  predictedOvulationDate: '2025-07-14',    // Ngày rụng trứng dự đoán
  predictedFertileWindowStartDate: '2025-07-10', // Cửa sổ thụ thai bắt đầu
  predictedFertileWindowEndDate: '2025-07-15',   // Cửa sổ thụ thai kết thúc
  nextPredictedDate: '2025-07-29'          // Dự đoán kỳ kinh nguyệt kế tiếp
};

// Lịch uống thuốc: thử loại 28 viên (test cả vỉ dài và lịch nhiều ngày)
export const mockPillSchedule = {
  id: 28,
  userId: 2,
  type: "28",
  startDate: "2025-07-01",
  pillTime: "07:00:00",
  currentIndex: 15,
  isActive: true,
  breakUntil: null
};
export const mockPillHistory = {
  '2025-07-01': true,
  '2025-07-02': false, // Quên 1
  '2025-07-03': true,
  '2025-07-04': false, // Quên 2
  '2025-07-05': true,
  '2025-07-06': true,
  '2025-07-07': true,
  '2025-07-08': false, // Quên 3
  '2025-07-09': false, // Quên 4
  '2025-07-10': true,
  // ...các ngày khác nếu muốn
};


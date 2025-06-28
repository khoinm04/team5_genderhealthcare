const PillStatsPanel = ({ stats }) => (
  <div className="mb-4">
    <div className="text-base text-gray-500 mb-1 italic text-center">
      * Thống kê này chỉ áp dụng cho tháng đang xem trên lịch.
    </div>
    <div className="flex gap-4 text-sm font-semibold">
      <div className="px-2 py-1 bg-green-100 rounded text-green-700 flex-1 text-center">
        Đã uống: {stats.taken}
      </div>
      <div className="px-2 py-1 bg-red-100 rounded text-red-700 flex-1 text-center">
        Quên: {stats.missed}
      </div>
      <div className="px-2 py-1 bg-blue-100 rounded text-blue-700 flex-1 text-center">
        Chưa uống: {stats.scheduled}
      </div>
    </div>
  </div>
);

export default PillStatsPanel;

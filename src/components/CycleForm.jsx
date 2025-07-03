const CycleForm = ({ cycleData, setCycleData, handleSaveCycle, disabled }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      Thông tin chu kỳ
    </h2>
    <div className="grid md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ngày bắt đầu kỳ kinh nguyệt
        </label>
        <input
          type="date"
          value={cycleData.startDate ?? ""}
          onChange={(e) =>
            setCycleData((prev) => ({
              ...prev,
              startDate: e.target.value,
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Độ dài chu kỳ (ngày)
        </label>
        <input
          type="number"
          value={cycleData.cycleLength ?? 28}
          onChange={(e) =>
            setCycleData((prev) => ({
              ...prev,
              cycleLength: parseInt(e.target.value),
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          min="20"
          max="45"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số ngày hành kinh
        </label>
        <input
          type="number"
          value={cycleData.periodDays ?? 5}
          onChange={(e) =>
            setCycleData((prev) => ({
              ...prev,
              periodDays: parseInt(e.target.value),
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          min="3"
          max="7"
          disabled={disabled}
        />
      </div>
    </div>
    <button
      onClick={handleSaveCycle}
      className={`px-6 py-2 rounded-lg transition-all text-white 
        ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 px-3 py-1 rounded-lg text-sm"
        }`}
      disabled={disabled}
    >
      Tính toán chu kỳ
    </button>
  </div>
);

export default CycleForm;

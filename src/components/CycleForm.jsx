<<<<<<< HEAD
const CycleForm = ({ cycleData, setCycleData, handleSaveCycle, disabled }) => (
=======
const CycleForm = ({ cycleData, setCycleData, handleSaveCycle }) => (
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
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
<<<<<<< HEAD
          value={cycleData.startDate ?? ""}
          onChange={e =>
            setCycleData(prev => ({
=======
          value={cycleData.startDate}
          onChange={(e) =>
            setCycleData((prev) => ({
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              ...prev,
              startDate: e.target.value,
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
<<<<<<< HEAD
          disabled={disabled}
=======
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Độ dài chu kỳ (ngày)
        </label>
        <input
          type="number"
<<<<<<< HEAD
          value={cycleData.cycleLength ?? 28}
          onChange={e =>
            setCycleData(prev => ({
=======
          value={cycleData.cycleLength}
          onChange={(e) =>
            setCycleData((prev) => ({
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              ...prev,
              cycleLength: parseInt(e.target.value),
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
<<<<<<< HEAD
          min="20"
          max="45"
          disabled={disabled}
=======
          min="21"
          max="35"
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số ngày hành kinh
        </label>
        <input
          type="number"
<<<<<<< HEAD
          value={cycleData.periodDays ?? 5}
          onChange={e =>
            setCycleData(prev => ({
=======
          value={cycleData.periodDays}
          onChange={(e) =>
            setCycleData((prev) => ({
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
              ...prev,
              periodDays: parseInt(e.target.value),
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          min="3"
          max="7"
<<<<<<< HEAD
          disabled={disabled}
=======
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
        />
      </div>
    </div>
    <button
      onClick={handleSaveCycle}
<<<<<<< HEAD
      className={`px-6 py-2 rounded-lg transition-all text-white 
      ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 px-3 py-1 rounded-lg text-sm'}`}
      // className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-all"
      disabled={disabled}
=======
      className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-2 rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all"
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
    >
      Tính toán chu kỳ
    </button>
  </div>
);
<<<<<<< HEAD

=======
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
export default CycleForm;

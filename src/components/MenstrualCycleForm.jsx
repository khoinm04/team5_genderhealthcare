import React, { useState } from "react";

const MenstrualCycleForm = ({ onSubmit, loading, initial }) => {
  const [startDate, setStartDate] = useState(initial?.startDate || "");
  const [cycleLength, setCycleLength] = useState(initial?.cycleLength || 28);
  const [menstruationDuration, setMenstruationDuration] = useState(initial?.menstruationDuration || 5);
  const [notes, setNotes] = useState(initial?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ startDate, cycleLength, menstruationDuration, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-[#8f5ed3] mb-2">Theo dõi chu kỳ kinh nguyệt</h2>
      <div>
        <label className="block font-semibold mb-1">Ngày bắt đầu</label>
        <input
          type="date"
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Số ngày giữa 2 chu kỳ</label>
        <input
          type="number"
          min={20}
          max={45}
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={cycleLength}
          onChange={(e) => setCycleLength(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Số ngày hành kinh</label>
        <input
          type="number"
          min={1}
          max={10}
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={menstruationDuration}
          onChange={(e) => setMenstruationDuration(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Ghi chú</label>
        <input
          type="text"
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={255}
        />
      </div>
      <button
        type="submit"
        className="bg-[#8f5ed3] text-white font-bold px-5 py-2 rounded-md hover:bg-[#68409c] transition"
        disabled={loading}
      >
        {loading ? "Đang lưu..." : "Lưu thông tin"}
      </button>
    </form>
  );
};

export default MenstrualCycleForm;

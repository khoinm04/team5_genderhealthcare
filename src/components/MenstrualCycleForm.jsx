// src/components/MenstrualCycleForm.jsx
import React, { useState } from 'react';
import { trackCycle } from '../serivces/MenstrualCycleService';

const MenstrualCycleForm = ({ customerId }) => {
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [menstruationDuration, setMenstruationDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trackCycle(customerId, startDate, cycleLength, menstruationDuration, notes);
      alert('Chu kỳ kinh nguyệt đã được theo dõi thành công');
    } catch (err) {
      setError('Có lỗi xảy ra khi theo dõi chu kỳ. Vui lòng thử lại!');
    }
  };

  return (
    <form className="max-w-md mx-auto mt-4" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Độ dài chu kỳ (ngày)</label>
        <input
          type="number"
          value={cycleLength}
          onChange={(e) => setCycleLength(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="20"
          max="45"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Số ngày hành kinh</label>
        <input
          type="number"
          value={menstruationDuration}
          onChange={(e) => setMenstruationDuration(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="1"
          max="10"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Chú thích (tùy chọn)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          maxLength="255"
        />
      </div>
      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">Theo dõi chu kỳ</button>
    </form>
  );
};

export default MenstrualCycleForm;

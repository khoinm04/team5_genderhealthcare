// src/components/PillScheduleForm.jsx
import React, { useState } from 'react';
import { Pill } from 'lucide-react';

// Hàm lấy ngày hôm nay theo yyyy-mm-dd
const todayStr = (() => {
  const d = new Date();
  return d.toISOString().split('T')[0];
})();

const PillScheduleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: '21',
    startDate: todayStr,
    time: '07:00',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.startDate) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Pill className="text-purple-500" />
        Đăng ký lịch uống thuốc tránh thai
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loại thuốc</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="21">21 viên</option>
            <option value="28">28 viên</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
          <input
            type="date"
            value={formData.startDate}
            min={todayStr}
            onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giờ uống thuốc</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
            step="60" // bước nhảy 1 phút
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            inputMode="numeric"
            pattern="[0-9]{2}:[0-9]{2}"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all font-medium"
        >
          Đăng ký lịch uống thuốc
        </button>
      </div>
    </form>
  );
};

export default PillScheduleForm;

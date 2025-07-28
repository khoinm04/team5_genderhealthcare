import React, { useState } from 'react';
import { Pill, History } from 'lucide-react';
import { toast } from "react-toastify";

const todayStr = (() => {
  const d = new Date();
  return d.toISOString().split('T')[0];
})();

const PillScheduleForm = ({ onSubmit, onShowHistory }) => {
  const [formData, setFormData] = useState({
    type: '21',
    pillName: '',
    startDate: todayStr,
    time: '07:00',
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pillName.trim()) {
      toast.error("Vui lòng nhập tên thuốc");
      return;
    }
    let pillTime = formData.time;
    if (pillTime.length === 5) pillTime += ':00';
    const data = {
      ...formData,
      pillTime,
      medicineName: formData.pillName,
    };
    delete data.time;
    delete data.pillName;
    setPendingFormData(data);
    setShowConfirmModal(true);

  };


  const handleConfirm = () => {
    if (pendingFormData) {
      onSubmit(pendingFormData);
    }
    setShowConfirmModal(false);
    setPendingFormData(null);
  };

  const handleDecline = () => {
    setShowConfirmModal(false);
    setPendingFormData(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Pill className="text-purple-500" />
            Đăng ký lịch uống thuốc tránh thai
          </div>
          <button
            onClick={onShowHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-pink-300 rounded-xl shadow-sm text-pink-600 font-semibold transition duration-300 ease-in-outhover:bg-pink-100 hover:text-pink-800 hover:shadow-lgactive:scale-95focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1"
            type="button"
          >
            <History className="w-5 h-5" />
            Xem lịch sử
          </button>
        </div>

        <div className="space-y-4">

          {/* Ô nhập tên thuốc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên thuốc (vui lòng ghi tiếng anh) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.pillName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pillName: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nhập tên thuốc bạn đang sử dụng"
            />
          </div>

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
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nhập ngày bắt đầu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Giờ uống thuốc</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              step="60"
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

      {/* Modal xác nhận hướng dẫn */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-pink-600">Hướng dẫn sử dụng thuốc tránh thai</h2>
            <div className="text-gray-700 text-sm max-h-72 overflow-y-auto">
              <p>
                <b>Đối với vỉ 21 viên:</b> Uống 1 viên/ngày từ ngày thứ nhất của chu kỳ kinh, liên tục suốt 21 ngày.
                Sau đó nghỉ 7 ngày rồi bắt đầu vỉ mới.
              </p>
              <p className="mt-2">
                <b>Đối với vỉ 28 viên:</b> Uống 1 viên/ngày liên tục cả 28 ngày (21 viên hormone, 7 viên giả dược), không nghỉ, hết vỉ này sang vỉ khác.
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Bắt đầu từ ngày đầu chu kỳ hoặc trong 5 ngày đầu có kinh.</li>
                <li>Nếu bắt đầu sau ngày đầu tiên diễn ra chu kì kinh nguyệt, thì cần dùng thêm bao cao su trong 7 ngày đầu tiên.</li>
              </ul>
              <p className="mt-2">
                <strong>Lưu ý quan trọng:</strong> Vui lòng đọc kỹ hướng dẫn sử dụng thuốc hoặc tham khảo ý kiến của bác sĩ trước khi sử dụng.
              </p>

            </div>
            <div className="flex justify-end gap-6 mt-6">
              <button
                className="min-w-[100px] px-10 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-base shadow transition-all"
                onClick={handleDecline}
              >
                Từ chối
              </button>
              <button
                className="min-w-[100px] px-10 py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-base shadow hover:from-pink-500 hover:to-purple-500 transition-all"
                onClick={handleConfirm}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PillScheduleForm;

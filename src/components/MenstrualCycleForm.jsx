import React, { useState } from 'react';
import { Calendar, Heart, Clock, Droplets, Save, AlertCircle } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
);

const MenstrualCycleForm = ({ cycle, onSubmit, onCancel, loading, userId }) => {
  const [formData, setFormData] = useState({
    startDate: cycle?.startDate || '',
    cycleLength: cycle?.cycleLength || 28,
    menstruationDuration: cycle?.menstruationDuration || 5,
    notes: cycle?.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'startDate':
        if (!value) {
          newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
        } else if (new Date(value) > new Date()) {
          newErrors.startDate = 'Ngày bắt đầu không thể là tương lai';
        } else if (formData.cycleLength) {
          const minDate = new Date();
          minDate.setDate(minDate.getDate() - formData.cycleLength);
          if (new Date(value) < minDate) {
            newErrors.startDate = `Ngày bắt đầu không được cách hiện tại quá ${formData.cycleLength} ngày`;
          } else {
            delete newErrors.startDate;
          }
        } else {
          delete newErrors.startDate;
        }
        break;
      case 'cycleLength':
        if (value < 20 || value > 45) {
          newErrors.cycleLength = 'Chu kỳ nên từ 20-45 ngày';
        } else {
          delete newErrors.cycleLength;
          if (formData.startDate) validateField('startDate', formData.startDate);
        }
        break;
      case 'menstruationDuration':
        if (value < 1 || value > 10) {
          newErrors.menstruationDuration = 'Thời gian hành kinh nên từ 1-10 ngày';
        } else if (value > formData.cycleLength) {
          newErrors.menstruationDuration = 'Không thể dài hơn chu kỳ';
        } else {
          delete newErrors.menstruationDuration;
        }
        break;
      case 'notes':
        if (value.length > 255) {
          newErrors.notes = 'Ghi chú không được vượt quá 255 ký tự';
        } else {
          delete newErrors.notes;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate tất cả trường trước khi gửi
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
      setTouched(prev => ({ ...prev, [key]: true }));
    });

    // Nếu có lỗi, không submit
    if (Object.keys(errors).length > 0) {
      alert("Vui lòng sửa các lỗi trước khi lưu!");
      return;
    }

    const apiData = {
      startDate: formData.startDate,
      cycleLength: Number(formData.cycleLength),
      menstruationDuration: Number(formData.menstruationDuration),
      notes: formData.notes,
    };

    try {
      // Gửi API
      await onSubmit({
        userId,
        ...apiData
      });
    } catch (error) {
      // Xử lý lỗi chi tiết từ backend
      alert(error?.response?.data?.message || "Lỗi khi gửi dữ liệu!");
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {cycle ? 'Cập nhật chu kỳ' : 'Theo dõi chu kỳ mới'}
        </h2>
        <p className="text-gray-600 mt-2">Nhập thông tin chu kỳ kinh nguyệt của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="inline mr-2" size={16} />
            Ngày bắt đầu chu kỳ
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.startDate ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
            required
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.startDate}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="inline mr-2" size={16} />
              Chu kỳ (ngày)
            </label>
            <input
              type="number"
              name="cycleLength"
              min="20"
              max="45"
              value={formData.cycleLength}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.cycleLength ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
              required
            />
            {errors.cycleLength && (
              <p className="text-red-500 text-sm mt-1">{errors.cycleLength}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Droplets className="inline mr-2" size={16} />
              Hành kinh (ngày)
            </label>
            <input
              type="number"
              name="menstruationDuration"
              min="1"
              max="10"
              value={formData.menstruationDuration}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.menstruationDuration ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
              required
            />
            {errors.menstruationDuration && (
              <p className="text-red-500 text-sm mt-1">{errors.menstruationDuration}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Triệu chứng, cảm xúc, hoặc ghi chú khác..."
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${errors.notes ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'} resize-none`}
            rows="3"
            maxLength="255"
          />
          <p className="text-gray-500 text-sm mt-1">{formData.notes.length}/255 ký tự</p>
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Save className="mr-2" size={18} />
                {cycle ? 'Cập nhật' : 'Lưu thông tin'}
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MenstrualCycleForm;

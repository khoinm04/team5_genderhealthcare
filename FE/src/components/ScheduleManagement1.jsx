import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Save,
  Eye,
  Star
} from 'lucide-react';

const ScheduleManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editStatus, setEditStatus] = useState('chờ xác nhận');
  const [editNotes, setEditNotes] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [viewingRating, setViewingRating] = useState(null);

  const [appointments, setAppointments] = useState([]);

  const statusOptions = [
    { value: 'đã xác nhận', label: 'Đã xác nhận', description: 'Staff đã assign consultant' },
    { value: 'đã lên lịch', label: 'Đã lên lịch', description: 'Đã sắp xếp thời gian cụ thể' },
    { value: 'đang tư vấn', label: 'Đang tư vấn', description: 'Đang trong quá trình tư vấn' },
    { value: 'hoàn thành', label: 'Hoàn thành', description: 'Đã hoàn thành buổi tư vấn' },
    { value: 'đã hủy', label: 'Đã hủy', description: 'Đã hủy lịch hẹn' },
    { value: 'đã đổi lịch', label: 'Đã đổi lịch', description: 'Đã thay đổi thời gian hẹn' }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'đã xác nhận':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'đã lên lịch':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'đang tư vấn':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hoàn thành':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'đã hủy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'đã đổi lịch':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'tư vấn':
        return 'bg-blue-500';
      case 'workshop':
        return 'bg-purple-500';
      case 'nội bộ':
        return 'bg-gray-500';
      default:
        return 'bg-teal-500';
    }
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    setEditStatus(appointment.status);
    setEditNotes(appointment.notes);
  };

  const statusMap = {
    "chờ xác nhận": "PENDING",
    "đã xác nhận": "CONFIRMED",
    "đã lên lịch": "SCHEDULED",
    "đang tư vấn": "ONGOING",
    "hoàn thành": "COMPLETED",
    "đã hủy": "CANCELED",
    "đã đổi lịch": "RESCHEDULED"
  };

  //GỌI LẠI 

  const handleSaveEdit = async () => {
    if (!editingAppointment) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/consultations/${editingAppointment.id}/consultant/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          note: editNotes,
          status: statusMap[editStatus] || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Cập nhật thất bại");
      }

      // Sau khi cập nhật, đồng bộ lại toàn bộ danh sách
      await fetchAppointments();

      // Đóng modal
      setEditingAppointment(null);
      setEditStatus("chờ xác nhận");
      setEditNotes("");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert(err.message);
    }
  };


  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setEditStatus('chờ xác nhận');
    setEditNotes('');
  };

  const handleViewRating = (appointment) => {
    setViewingRating(appointment);
  };

  const handleCloseRating = () => {
    setViewingRating(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  //api lay danh sach lich hen tu van vien

  const fetchAppointments = useCallback(async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const consultantId = user?.userId;

    if (!token || !consultantId) return;

    try {
      const res = await fetch(`/api/consultations/consultant/${consultantId}/consultations?page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không thể tải lịch hẹn");

      const json = await res.json();
      const data = json.consultations ?? [];

      const mapped = data.map(item => ({
        id: item.consultationId,
        title: item.serviceNames,
        client: item.customerName,
        email: item.customerEmail,
        date: item.dateScheduled,
        time: item.timeSlot?.split("-")[0] || "",
        duration: getDuration(item.timeSlot),
        type: item.categoryTypes?.[0]?.toLowerCase() || "khác",
        status: item.statusDescription?.trim().toLowerCase(),
        notes: item.note,
        rating: item.rating || 0,
        feedback: item.feedback || "",
      }));

      setAppointments(mapped);
      setTotalPages(json.totalPages); // 👈 nếu bạn cần hiển thị phân trang
    } catch (err) {
      console.error("❌ Lỗi khi tải lịch:", err);
    }
  }, [page, size]);


  useEffect(() => {
    fetchAppointments(); // không còn cảnh báo
  }, [fetchAppointments]);

  const getDuration = (timeSlot) => {
    if (!timeSlot) return 0;
    const [start, end] = timeSlot.split("-");
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lịch trình</h1>
            <p className="text-gray-600">Quản lý các buổi tư vấn và cuộc hẹn của bạn</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Tháng
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900">
              {viewMode === 'month'
                ? currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
                : formatDate(currentDate)
              }
            </h2>

            <button
              onClick={() => navigateDate(1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </button>
        </div>

        {/* Schedule View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-1 h-16 ${getTypeColor(appointment.type)} rounded-full`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {appointment.client}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(appointment.date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.time} ({appointment.duration} phút)
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-sm font-semibold rounded-full border shadow-sm ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewRating(appointment)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Xem đánh giá"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(appointment)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 pb-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ◀ Trang trước
          </button>

          <span className="text-sm font-medium text-gray-700">
            Trang {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trang sau ▶
          </button>

          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0); // reset về trang đầu nếu đổi size
            }}
            className="ml-4 px-2 py-1 border rounded"
          >
            <option value={5}>5 dòng/trang</option>
            <option value={10}>10 dòng/trang</option>
            <option value={20}>20 dòng/trang</option>
          </select>
        </div>


      {/* Edit Modal */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa lịch hẹn</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Appointment Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{editingAppointment.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Khách hàng:</span> {editingAppointment.client}
                    </div>
                    <div>
                      <span className="font-medium">Ngày:</span> {new Date(editingAppointment.date).toLocaleDateString('vi-VN')}
                    </div>
                    <div>
                      <span className="font-medium">Thời gian:</span> {editingAppointment.time}
                    </div>
                    <div>
                      <span className="font-medium">Thời lượng:</span> {editingAppointment.duration} phút
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Trạng thái
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {statusOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={editStatus === option.value}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(option.value)}`}>
                              {option.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    id="notes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Nhập ghi chú cho lịch hẹn..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating & Feedback Modal */}
      {viewingRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Đánh giá & Phản hồi</h2>
                <button
                  onClick={handleCloseRating}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Appointment Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{viewingRating.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Khách hàng:</span> {viewingRating.client}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {viewingRating.email}
                    </div>
                    <div>
                      <span className="font-medium">Ngày:</span> {new Date(viewingRating.date).toLocaleDateString('vi-VN')}
                    </div>
                    <div>
                      <span className="font-medium">Thời gian:</span> {viewingRating.time}
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Đánh giá của khách hàng</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(viewingRating.rating)}
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {viewingRating.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  {viewingRating.rating === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <Star className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-gray-500">Khách hàng chưa đánh giá</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-1 py-4">
                        {renderStars(viewingRating.rating)}
                      </div>
                      
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {viewingRating.rating === 5 ? 'Xuất sắc' :
                           viewingRating.rating === 4 ? 'Tốt' :
                           viewingRating.rating === 3 ? 'Khá' :
                           viewingRating.rating === 2 ? 'Trung bình' : 'Cần cải thiện'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feedback Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Phản hồi chi tiết</h4>
                  
                  {viewingRating.feedback ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{viewingRating.client}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(viewingRating.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{viewingRating.feedback}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <User className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-gray-500">Khách hàng chưa để lại phản hồi</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseRating}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
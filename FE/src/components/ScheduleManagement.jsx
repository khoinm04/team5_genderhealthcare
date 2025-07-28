import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Filter, ChevronLeft, ChevronRight, Edit, Trash2, MoreVertical, Users, UserCheck, X } from 'lucide-react';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // 👈 THÊM Ở ĐÂY



  // Keyboard shortcuts

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/manager/page/bookings?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Không thể load booking');
        return res.json();
      })
      .then(data => {
        setSchedules(data.content);          // danh sách lịch
        setTotalPages(data.totalPages);     // tổng số trang
      })
      .catch((err) => {
        console.error('Lỗi khi tải lịch:', err);
        alert("Phiên đăng nhập hết hạn hoặc không có quyền.");
      });
  }, [page, size]);


  // dung de gan mau cho tung loại
  const getServiceColor = (name) => {
    if (name.includes("Tư vấn")) {
      return "bg-orange-100 text-orange-800"; // Cam cho dịch vụ ưu tiên
    }
    return "bg-green-100 text-green-800"; // Xanh lá mặc định
  };



  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING_PAYMENT: {
        label: 'Chờ thanh toán',
        class: 'bg-yellow-100 text-yellow-800'
      },
      CONFIRMED: {
        label: 'Đã xác nhận',
        class: 'bg-green-100 text-green-800'
      },
      COMPLETED: {
        label: 'Đã thanh toán',
        class: 'bg-green-100 text-green-800'
      },
      CANCELED: {
        label: 'Đã hủy',
        class: 'bg-red-100 text-red-800'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const openModal = (type, schedule = null) => {
    setModalType(type);
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleSaveSchedule = async (formData) => {
    const token = localStorage.getItem("token");

    // Gộp timeSlot
    const payload = {
      bookingId: selectedSchedule.bookingId,
      bookingDate: formData.date,
      timeSlot: `${formData.startTime}-${formData.endTime}`,
        consultantId: formData.consultantId, // ✅ Thêm dòng này để cập nhật consultation status

    };

    try {
      const res = await fetch(`http://localhost:8080/api/manager/${selectedSchedule.bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const msg = await res.text();
      if (!res.ok) {
        alert("❌ Cập nhật thất bại: " + msg);
        return;
      }

      // Cập nhật local state
      setSchedules((prev) =>
        prev.map((s) =>
          s.bookingId === selectedSchedule.bookingId
            ? { ...s, ...formData }
            : s
        )
      );

      closeModal();
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
      alert("Có lỗi khi cập nhật.");
    }
  };


  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      setSchedules(schedules.filter(schedule => schedule.id !== selectedSchedule.id));
      closeModal();
    }
  };

  const handleStatusChange = async (scheduleId, newStatus) => {
    console.log("🔁 handleStatusChange:", { scheduleId, newStatus }); // ✅ LOG ở đây

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/manager/${scheduleId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert("❌ Lỗi khi cập nhật trạng thái: " + msg);
        return;
      }

      // Cập nhật lại trong local state nếu API thành công
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === scheduleId ? { ...s, status: newStatus } : s
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };


  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch làm việc</h1>
          <p className="text-gray-600 mt-1">Xem và quản lý lịch hẹn của nhân viên và dịch vụ xét nghiệm</p>
        </div>

      </div>

      

      {/* Schedule List View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h3>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)} // 👈 thêm dòng này
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                <option value="CANCELED">Đã hủy</option>
                <option value="CONFIRMED">Đã xác nhận</option>
              </select>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {(filterStatus === 'all'
            ? schedules
            : schedules.filter(s => s.status === filterStatus)
          ).map((schedule) => (
            <div key={schedule.id} className="p-6 hover:bg-gray-50 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Calendar size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {schedule.staffName
                        ? `NV. ${schedule.staffName}`
                        : schedule.consultantName
                          ? `TV. ${schedule.consultantName}`
                          : 'Chưa có nhân viên / tư vấn viên'}
                    </h4>

                    <div className="flex items-center mt-1 space-x-4 text-sm">
                      <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-md font-medium">
                        <User size={16} className="mr-1" />
                        Khách hàng: {schedule.client}
                      </div>
                      <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-md font-medium">
                        <Clock size={16} className="mr-1" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="mb-2">{getStatusBadge(schedule.status)}</div>
                    <p className="text-sm text-gray-600">{formatDate(schedule.bookingDate)}</p>
                    {schedule.serviceName && (
                      <p className={`text-sm mt-1 inline-block px-2 py-1 rounded-full font-medium ${getServiceColor(schedule.serviceName)}`}>
                        {schedule.serviceName}
                      </p>

                    )}
                  </div>

                  {/* Action Buttons (ẩn/hiện khi hover dòng) */}
                  {/* Action Buttons (luôn hiện) */}
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal('edit', schedule)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      {/* <button
                        onClick={() => openModal('delete', schedule)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button> */}
                      <div className="relative">
                        <select
                          value={schedule.status}
                          onChange={(e) => {
                            console.log("🔁 Changing status of:", schedule.id, "to", e.target.value);
                            handleStatusChange(schedule.bookingId, e.target.value);
                          }} className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          title="Thay đổi trạng thái"
                        >
                          <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                          <option value="CONFIRMED">Đã xác nhận</option>
                          <option value="COMPLETED">Đã thanh toán</option>
                          <option value="CANCELED">Đã hủy</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
        
        {schedules.length === 0 && (
          <div className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
            <p className="text-gray-600 mb-4">Bắt đầu bằng cách thêm lịch hẹn mới cho khách hàng</p>
            
          </div>
        )}
      </div>
      {/* Pagination Controls */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'add' ? 'Thêm lịch hẹn mới' :
                  modalType === 'edit' ? 'Chỉnh sửa lịch hẹn' : 'Xác nhận xóa'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {modalType === 'delete' ? (
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    Bạn có chắc chắn muốn xóa lịch hẹn của "{selectedSchedule?.staffName}" với khách hàng "{selectedSchedule?.client}"?
                  </p>
                  <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
                </div>
              ) : (
                <ScheduleForm
                  schedule={selectedSchedule}
                  onSave={handleSaveSchedule}
                  onCancel={closeModal}
                />
              )}
            </div>
            {modalType === 'delete' && (
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteSchedule}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Schedule Form Component with cancel and create buttons
const ScheduleForm = ({ schedule, onSave, onCancel }) => {

  const [staffList, setStaffList] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  const [formData, setFormData] = useState({
    bookingId: schedule?.bookingId || '',
    staffId: schedule?.staffId || '',
    staffName: schedule?.fullName || '',
    consultantId: schedule?.consultantId || '',
    consultantName: schedule?.consultantName || '',
    client: schedule?.client || '',
    serviceName: schedule?.serviceName || '', // dùng để hiển thị nếu muốn
    serviceIds: Array.isArray(schedule.serviceIds) ? schedule.serviceIds : [],
    date: schedule?.date || new Date().toISOString().split('T')[0],
    startTime: schedule?.startTime || '09:00',
    endTime: schedule?.endTime || '10:00',
    notes: schedule?.notes || ''
  });


  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token); // kiểm tra token

    fetch("http://localhost:8080/api/manager/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("📡 Service API status:", res.status);
        if (!res.ok) throw new Error("Không thể load dịch vụ");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Service list:", data);
        setServiceList(data);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy service:", err);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/manager/staffs?page=0&size=100", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể load nhân viên");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Danh sách nhân viên (phân trang):", data);
        setStaffList(data.content); // 👈 CHỈ LẤY PHẦN CONTENT
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy danh sách nhân viên:", err);
      });
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/manager/consultants?page=0&size=100", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể load tư vấn viên");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Danh sách tư vấn viên (phân trang):", data);
        setConsultantList(data.content); // 👈 chỉ lấy danh sách tư vấn viên
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy danh sách tư vấn viên:", err);
      });
  }, []);

  const quickFillTime = (timeSlot) => {
    const timeSlots = {
      'morning': { startTime: '08:00', endTime: '09:00' },
      'mid-morning': { startTime: '09:00', endTime: '10:00' },
      'afternoon': { startTime: '14:00', endTime: '15:00' },
      'late-afternoon': { startTime: '15:00', endTime: '16:00' }
    };

    if (timeSlots[timeSlot]) {
      setFormData({
        ...formData,
        startTime: timeSlots[timeSlot].startTime,
        endTime: timeSlots[timeSlot].endTime
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation — bỏ yêu cầu staffId
    if (!formData.client || !formData.serviceName || !formData.date || !formData.startTime || !formData.endTime) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate time
    if (formData.startTime >= formData.endTime) {
      alert('Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // Nếu là chỉnh sửa lịch đã có bookingId
      if (formData.bookingId) {

        // Gán nhân viên nếu được chọn
        if (formData.staffId) {
          console.log("📤 Đang gọi API gán nhân viên:", {
            bookingId: formData.bookingId,
            staffId: formData.staffId
          });

          const res = await fetch(`http://localhost:8080/api/manager/bookings/${formData.bookingId}/assign-staff?staffId=${formData.staffId}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!res.ok) {
            const msg = await res.text();
            alert("Lỗi khi gán nhân viên: " + msg);
            return;
          }
        }

        // Gán tư vấn viên nếu được chọn
        if (formData.consultantId) {
          console.log("📤 Đang gọi API gán tư vấn viên:", {
            bookingId: formData.bookingId,
            consultantId: formData.consultantId
          });

          const res = await fetch(`http://localhost:8080/api/manager/bookings/${formData.bookingId}/assign-consultant?consultantId=${formData.consultantId}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!res.ok) {
            const msg = await res.text();
            alert("Lỗi khi gán tư vấn viên: " + msg);
            return;
          }
        }
      }

      // Gọi hàm onSave
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("💾 onSave được gọi với formData:", formData);
      onSave(formData);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Có lỗi xảy ra khi lưu lịch hẹn');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleStaffChange = (e) => {
    console.log("🔁 onChange chạy", e.target.value);

    const selectedId = parseInt(e.target.value);
    const selectedStaff = staffList.find(s => s.id === selectedId);
    console.log("👤 Nhân viên được chọn:", selectedStaff);

    setFormData(prev => ({
      ...prev,
      staffId: selectedId,
      staffName: selectedStaff?.fullName || ''
    }));
  };

  const handleConsultantChange = (e) => {
    console.log("🔁 onChange chạy", e.target.value);

    const selectedId = parseInt(e.target.value);
    const selectedConsultant = consultantList.find(s => s.id === selectedId);
    console.log("👤 Tu vấn viên được chọn:", selectedConsultant);

    setFormData(prev => ({
      ...prev,
      consultantId: selectedId,
      consultantName: selectedConsultant?.fullName || ''
    }));
  };



  const handleCancel = () => {
    if (JSON.stringify(formData) !== JSON.stringify({
      staffId: schedule?.staffId || '',
      staffName: schedule?.staffName || '',
      consultantId: schedule?.consultantId || '',
      consultantName: schedule?.consultantName || '',
      client: schedule?.client || '',
      serviceName: schedule?.serviceName || '',
      date: schedule?.date || new Date().toISOString().split('T')[0],
      startTime: schedule?.startTime || '09:00',
      endTime: schedule?.endTime || '10:00',
      notes: schedule?.notes || '' // giữ nếu bạn có trường ghi chú riêng
    })) {
      if (confirm('Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn hủy?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };
  const specializationToVietnamese = {
    GENERAL_CONSULTATION: "Tư vấn tổng quát",
    SPECIALIST_CONSULTATION: "Tư vấn chuyên khoa",
    RE_EXAMINATION: "Tư vấn tái khám",
    EMERGENCY_CONSULTATION: "Tư vấn khẩn cấp",
    STI_HIV: "Xét nghiệm HIV",
    STI_Syphilis: "Xét nghiệm giang mai (Syphilis)",
    STI_Gonorrhea: "Xét nghiệm lậu (Gonorrhea)",
    STI_Chlamydia: "Xét nghiệm Chlamydia",
    // thêm các mục khác nếu có
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nhân viên phụ trách hoặc tư vấn viên phụ trách <span className="text-red-500">*</span>
        </label>

        {/* Staff Section */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-blue-600 mb-1">NHÂN VIÊN</label>
          <select
            onChange={handleStaffChange}
            value={String(formData.staffId || '')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Chọn nhân viên</option>
            {staffList
              .filter(staff => staff.active === true)
              .map(staff => (
                <option key={staff.id} value={String(staff.id)}>
  {staff.fullName} - {staff.specialization || 'Chưa xác định'}
</option>
              ))}
          </select>

        </div>

        {/* Consultants Section */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-blue-600 mb-1">TƯ VẤN VIÊN</label>
          <select
            onChange={handleConsultantChange}
            value={String(formData.consultantId || '')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Chọn tư vấn viên</option>
            {consultantList
              .filter(consultant => consultant.active === true)
              .map(consultant => (
                <option key={consultant.id} value={String(consultant.id)}>
  {consultant.fullName} - {consultant.specialization || 'Chưa xác định'}
</option>

              ))}
          </select>

        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dịch vụ <span className="text-red-500">*</span>
        </label>
        <select
          value={(formData.serviceIds || []).map(String)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
            console.log("🛠 Selected service IDs:", selected);
            setFormData(prev => ({ ...prev, serviceIds: selected }));
          }}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"

          required
        >
          <optgroup label="Dịch vụ tư vấn">
            {serviceList
              .filter(s => s.active && !['STI_HIV', 'STI_Syphilis', 'STI_Gonorrhea', 'STI_Chlamydia'].includes(s.category))
              .map(s => (
                <option key={s.serviceId} value={s.serviceId}>{s.serviceName}</option>
              ))}
          </optgroup>
          <optgroup label="Dịch vụ xét nghiệm">
            {serviceList
              .filter(s => s.active && ['STI_HIV', 'STI_Syphilis', 'STI_Gonorrhea', 'STI_Chlamydia'].includes(s.category))
              .map(s => (
                <option key={s.serviceId} value={s.serviceId}>{s.serviceName}</option>
              ))}
          </optgroup>
        </select>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Giờ bắt đầu <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => quickFillTime('morning')}
                className="text-xs px-1 py-0.5 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                title="8:00-9:00"
              >
                Sáng
              </button>
              <button
                type="button"
                onClick={() => quickFillTime('afternoon')}
                className="text-xs px-1 py-0.5 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                title="14:00-15:00"
              >
                Chiều
              </button>
            </div>
          </div>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Giờ kết thúc <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Ghi chú thêm về cuộc hẹn..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <X size={16} className="mr-2" />
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              {schedule ? 'Cập nhật lịch hẹn' : 'Tạo lịch hẹn'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ScheduleManagement;
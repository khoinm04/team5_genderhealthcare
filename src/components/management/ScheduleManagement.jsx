import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Filter, ChevronLeft, ChevronRight, Edit, Trash2, MoreVertical, Users, UserCheck, X } from 'lucide-react';
import { mockSchedules, mockServices, mockStaff, mockConsultants } from '../data/mockData';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger shortcuts when not typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      switch (e.key) {
        case 'n':
        case 'N':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            openModal('add');
          }
          break;
        case 't':
        case 'T':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCurrentDate(new Date());
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            navigateDate('prev');
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            navigateDate('next');
          }
          break;
        case 'Escape':
          if (showModal) {
            closeModal();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { label: 'Đã lên lịch', class: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800' }
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

  const handleSaveSchedule = (formData) => {
    if (modalType === 'add') {
      const newSchedule = {
        id: Date.now().toString(),
        ...formData,
        status: 'scheduled'
      };
      setSchedules([...schedules, newSchedule]);
    } else if (modalType === 'edit') {
      setSchedules(schedules.map(schedule => 
        schedule.id === selectedSchedule.id 
          ? { ...schedule, ...formData }
          : schedule
      ));
    }
    closeModal();
  };

  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      setSchedules(schedules.filter(schedule => schedule.id !== selectedSchedule.id));
      closeModal();
    }
  };

  const handleStatusChange = (scheduleId, newStatus) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: newStatus }
        : schedule
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch làm việc</h1>
          <p className="text-gray-600 mt-1">Xem và quản lý lịch hẹn của nhân viên và dịch vụ xét nghiệm</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Thêm lịch hẹn
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('vi-VN', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hôm nay
            </button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['day', 'week', 'month']).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === mode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'day' ? 'Ngày' : mode === 'week' ? 'Tuần' : 'Tháng'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule List View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h3>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="all">Tất cả trạng thái</option>
                <option value="scheduled">Đã lên lịch</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-6 hover:bg-gray-50 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Calendar size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{schedule.personName}</h4>
                    <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User size={16} className="mr-1" />
                        {schedule.client}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="mb-2">
                      {getStatusBadge(schedule.status)}
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(schedule.date)}</p>
                    {schedule.service && (
                      <p className="text-sm text-gray-500 mt-1">{schedule.service}</p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal('edit', schedule)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openModal('delete', schedule)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    {/* Status Change Dropdown */}
                    <div className="relative">
                      <select
                        value={schedule.status}
                        onChange={(e) => handleStatusChange(schedule.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        title="Thay đổi trạng thái"
                      >
                        <option value="scheduled">Đã lên lịch</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
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
            <button
              onClick={() => openModal('add')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Thêm lịch hẹn đầu tiên
            </button>
          </div>
        )}
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
                    Bạn có chắc chắn muốn xóa lịch hẹn của "{selectedSchedule?.personName}" với khách hàng "{selectedSchedule?.client}"?
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
  const [formData, setFormData] = useState({
    personId: schedule?.personId || '',
    personName: schedule?.personName || '',
    client: schedule?.client || '',
    service: schedule?.service || '',
    date: schedule?.date || new Date().toISOString().split('T')[0],
    startTime: schedule?.startTime || '09:00',
    endTime: schedule?.endTime || '10:00',
    notes: schedule?.notes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill shortcuts
  const quickFillClient = (clientType) => {
    const clientNames = {
      'new': 'Khách hàng mới',
      'return': 'Khách hàng cũ',
      'company': 'Công ty ABC',
      'individual': 'Cá nhân'
    };
    setFormData({...formData, client: clientNames[clientType] || clientType});
  };

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
    
    // Basic validation
    if (!formData.personName || !formData.client || !formData.service || !formData.date || !formData.startTime || !formData.endTime) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Có lỗi xảy ra khi lưu lịch hẹn');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('staff-')) {
      const staffId = value.replace('staff-', '');
      const staff = mockStaff.find(s => s.id === staffId);
      setFormData({
        ...formData,
        personId: staffId,
        personName: staff?.name || ''
      });
    } else if (value.startsWith('consultant-')) {
      const consultantId = value.replace('consultant-', '');
      const consultant = mockConsultants.find(c => c.id === consultantId);
      setFormData({
        ...formData,
        personId: consultantId,
        personName: consultant?.name || ''
      });
    }
  };

  const handleCancel = () => {
    if (JSON.stringify(formData) !== JSON.stringify({
      personId: schedule?.personId || '',
      personName: schedule?.personName || '',
      client: schedule?.client || '',
      service: schedule?.service || '',
      date: schedule?.date || new Date().toISOString().split('T')[0],
      startTime: schedule?.startTime || '09:00',
      endTime: schedule?.endTime || '10:00',
      notes: schedule?.notes || ''
    })) {
      if (confirm('Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn hủy?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nhân viên phụ trách <span className="text-red-500">*</span>
        </label>
        
        {/* Staff Section */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-blue-600 mb-1">NHÂN VIÊN</label>
          <select 
            onChange={handlePersonChange}
            value={formData.personId && mockStaff.find(s => s.id === formData.personId) ? `staff-${formData.personId}` : ''}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Chọn nhân viên</option>
            {mockStaff.filter(staff => staff.status === 'active').map(staff => (
              <option key={`staff-${staff.id}`} value={`staff-${staff.id}`}>{staff.name} - {staff.department}</option>
            ))}
          </select>
        </div>

        {/* Consultants Section */}
        <div>
          <label className="block text-xs font-medium text-emerald-600 mb-1">TƯ VẤN VIÊN</label>
          <select 
            onChange={handlePersonChange}
            value={formData.personId && mockConsultants.find(c => c.id === formData.personId) ? `consultant-${formData.personId}` : ''}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Chọn tư vấn viên</option>
            {mockConsultants.filter(consultant => consultant.status === 'available').map(consultant => (
              <option key={`consultant-${consultant.id}`} value={`consultant-${consultant.id}`}>{consultant.name} - {consultant.specialization}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Khách hàng <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => quickFillClient('new')}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              title="Khách hàng mới"
            >
              Mới
            </button>
            <button
              type="button"
              onClick={() => quickFillClient('return')}
              className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
              title="Khách hàng cũ"
            >
              Cũ
            </button>
            <button
              type="button"
              onClick={() => quickFillClient('company')}
              className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
              title="Công ty"
            >
              Công ty
            </button>
          </div>
        </div>
        <input
          type="text"
          value={formData.client}
          onChange={(e) => setFormData({...formData, client: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Tên khách hàng"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dịch vụ <span className="text-red-500">*</span>
        </label>
        <select 
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        >
          <option value="">Chọn dịch vụ</option>
          <optgroup label="Dịch vụ tư vấn">
            {mockServices.filter(service => service.category !== 'Y tế' && service.status === 'active').map(service => (
              <option key={service.id} value={service.name}>{service.name}</option>
            ))}
          </optgroup>
          <optgroup label="Dịch vụ xét nghiệm">
            {mockServices.filter(service => service.category === 'Y tế' && service.status === 'active').map(service => (
              <option key={service.id} value={service.name}>{service.name}</option>
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
            onChange={(e) => setFormData({...formData, date: e.target.value})}
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
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
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
          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
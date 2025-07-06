import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Video,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

const ScheduleManagementC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const appointments = [
    {
      id: 1,
      title: 'Buổi tư vấn chiến lược Marketing',
      client: 'Nguyễn Thị Hoa',
      email: 'hoa@example.com',
      date: '2024-01-16',
      time: '10:00',
      duration: 60,
      type: 'tư vấn',
      status: 'đã xác nhận',
      notes: 'Tập trung vào marketing số cho doanh nghiệp địa phương'
    },
    {
      id: 2,
      title: 'Cuộc gọi lập kế hoạch kinh doanh',
      client: 'Trần Văn Nam',
      email: 'nam@example.com',
      date: '2024-01-16',
      time: '14:30',
      duration: 45,
      type: 'tư vấn',
      status: 'đã xác nhận',
      notes: 'Đánh giá kinh doanh quý và lập kế hoạch'
    },
    {
      id: 3,
      title: 'Họp đánh giá nhóm',
      client: 'Nhóm nội bộ',
      email: '',
      date: '2024-01-16',
      time: '16:00',
      duration: 30,
      type: 'nội bộ',
      status: 'đã xác nhận',
      notes: 'Đồng bộ nhóm hàng tuần và cập nhật dự án'
    },
    {
      id: 4,
      title: 'Workshop chiến lược tăng trưởng',
      client: 'Lê Thị Mai',
      email: 'mai@example.com',
      date: '2024-01-17',
      time: '11:00',
      duration: 90,
      type: 'workshop',
      status: 'chờ xác nhận',
      notes: 'Phát triển chiến lược tăng trưởng toàn diện'
    },
    {
      id: 5,
      title: 'Buổi tư vấn lập kế hoạch tài chính',
      client: 'Phạm Văn Đức',
      email: 'duc@example.com',
      date: '2024-01-18',
      time: '09:30',
      duration: 60,
      type: 'tư vấn',
      status: 'đã xác nhận',
      notes: 'Lập kế hoạch ngân sách và dự báo tài chính'
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getAppointmentForSlot = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.find(apt => apt.date === dateStr && apt.time === time);
  };

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
      case 'đã hủy':
        return 'bg-red-100 text-red-800 border-red-200';
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

  return (
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
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tháng
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Cuộc hẹn mới
          </button>
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
      {viewMode === 'day' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Time Slots */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-gray-200">
                {timeSlots.map((time) => {
                  const appointment = getAppointmentForSlot(currentDate, time);
                  return (
                    <div key={time} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 text-sm font-medium text-gray-500">{time}</div>
                        <div className="flex-1">
                          {appointment ? (
                            <div className={`p-3 rounded-lg border-l-4 ${getTypeColor(appointment.type)} border-opacity-100`}>
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                                  <p className="text-sm text-gray-600">{appointment.client}</p>
                                  <div className="flex items-center mt-2">
                                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-500">{appointment.duration} phút</span>
                                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                                      {appointment.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-12 flex items-center">
                              <button
                                onClick={() => setSelectedSlot({ date: currentDate, time })}
                                className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                + Thêm cuộc hẹn
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt hôm nay</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng cuộc hẹn</span>
                  <span className="font-medium">{getAppointmentsForDate(currentDate).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã xác nhận</span>
                  <span className="font-medium text-green-600">
                    {getAppointmentsForDate(currentDate).filter(apt => apt.status === 'đã xác nhận').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chờ xác nhận</span>
                  <span className="font-medium text-yellow-600">
                    {getAppointmentsForDate(currentDate).filter(apt => apt.status === 'chờ xác nhận').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Video className="w-4 h-4 mr-2" />
                  Bắt đầu cuộc gọi video
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Xem lịch đầy đủ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-1 h-16 ${getTypeColor(appointment.type)} rounded-full`}></div>
                    <div>
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
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Cuộc hẹn mới</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tiêu đề cuộc hẹn..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách hàng</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tên khách hàng..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="tư vấn">Tư vấn</option>
                  <option value="workshop">Workshop</option>
                  <option value="nội bộ">Họp nội bộ</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200">
                Tạo cuộc hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagementC;
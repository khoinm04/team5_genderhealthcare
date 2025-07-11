import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Edit3, Trash2, Plus, Save, X, Search } from 'lucide-react';

const ConsultingScheduleManager = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Văn An',
      phone: '0901234567',
      email: 'nva@email.com',
      date: '2025-06-10',
      startTime: '09:00',
      endTime: '10:30',
      service: 'Tư vấn tài chính',
      status: 'Đã xác nhận',
      notes: 'Khách hàng quan tâm đến gói đầu tư dài hạn'
    },
    {
      id: 2,
      customerName: 'Trần Thị Bình',
      phone: '0987654321',
      email: 'ttb@email.com',
      date: '2025-06-11',
      startTime: '14:30',
      endTime: '15:30',
      service: 'Tư vấn bảo hiểm',
      status: 'Chờ xác nhận',
      notes: 'Cần tư vấn bảo hiểm sức khỏe gia đình'
    },
    {
      id: 3,
      customerName: 'Lê Minh Cường',
      phone: '0912345678',
      email: 'lmc@email.com',
      date: '2025-06-12',
      startTime: '10:15',
      endTime: '11:45',
      service: 'Tư vấn đầu tư',
      status: 'Đã hoàn thành',
      notes: 'Đã ký hợp đồng đầu tư 500 triệu'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: '',
    startTime: '',
    endTime: '',
    service: '',
    status: 'Chờ xác nhận',
    notes: ''
  });

  const serviceOptions = [
    'Tư vấn tài chính',
    'Tư vấn bảo hiểm',
    'Tư vấn đầu tư',
    'Tư vấn vay vốn',
    'Tư vấn tiết kiệm'
  ];

  const statusOptions = [
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang tư vấn',
    'Đã hoàn thành',
    'Đã hủy'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Chờ xác nhận': 'bg-yellow-100 text-yellow-800',
      'Đã xác nhận': 'bg-blue-100 text-blue-800',
      'Đang tư vấn': 'bg-purple-100 text-purple-800',
      'Đã hoàn thành': 'bg-green-100 text-green-800',
      'Đã hủy': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.phone.includes(searchTerm) ||
                         schedule.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Tất cả' || schedule.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData(schedule);
    } else {
      setEditingSchedule(null);
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        date: '',
        startTime: '',
        endTime: '',
        service: serviceOptions[0],
        status: 'Chờ xác nhận',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      date: '',
      startTime: '',
      endTime: '',
      service: '',
      status: 'Chờ xác nhận',
      notes: ''
    });
  };

  const handleSubmit = () => {
    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.id === editingSchedule.id 
          ? { ...formData, id: editingSchedule.id }
          : schedule
      ));
    } else {
      const newSchedule = {
        ...formData,
        id: Date.now()
      };
      setSchedules([...schedules, newSchedule]);
    }
    closeModal();
  };

  const deleteSchedule = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch tư vấn này?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="text-blue-600" />
              Quản lý lịch tư vấn khách hàng
            </h1>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Tạo lịch mới
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, số điện thoại hoặc dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lịch hẹn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{schedule.customerName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={12} />
                            {schedule.phone}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {schedule.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(schedule.date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={schedule.notes}>
                        {schedule.notes || 'Không có ghi chú'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(schedule)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSchedules.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch tư vấn</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'Tất cả' ? 'Không tìm thấy kết quả phù hợp' : 'Bắt đầu bằng cách tạo lịch tư vấn mới'}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingSchedule ? 'Chỉnh sửa lịch tư vấn' : 'Tạo lịch tư vấn mới'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên khách hàng *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày tư vấn *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giờ bắt đầu *
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giờ kết thúc *
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dịch vụ tư vấn *
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {serviceOptions.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập ghi chú về khách hàng hoặc yêu cầu đặc biệt..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <Save size={16} />
                      {editingSchedule ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultingScheduleManager;
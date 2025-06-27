import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Plus, Edit3, Trash2, Eye, Search, Filter,
  CheckCircle, XCircle, Loader2, AlertCircle, Phone, Mail, FileText,
  Users, Activity, TestTube, Stethoscope, ChevronRight, Bell,
  BarChart3, TrendingUp, Settings, Save, X
} from 'lucide-react';



const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Schedules State
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com',
      consultantName: 'BS. Trần Thị Hoa',
      date: '2025-01-15',
      startTime: '10:00',
      endTime: '11:00',
      status: 'scheduled',
      service: 'Tái khám',
      duration: '60 phút'
    },
    {
      id: 2,
      customerName: 'Lê Thị Bình',
      email: 'lethibinh@email.com',
      consultantName: 'ThS. Phạm Văn Cường',
      date: '2025-01-16',
      startTime: '14:00',
      endTime: '14:45',
      status: 'confirmed',
      service: 'Tư vấn chuyên khoa',
      duration: '45 phút'
    },
    {
      id: 3,
      customerName: 'Hoàng Minh Đức',
      email: 'hoangminhduc@email.com',
      consultantName: 'BS. Trần Thị Hoa',
      date: '2025-01-14',
      startTime: '15:30',
      endTime: '17:00',
      status: 'completed',
      service: 'Tư vấn tổng quát',
      duration: '90 phút'
    }
  ]);

  // STI Tests State
  const [testOrders, setTestOrders] = useState([
    {
      id: 1,
      customerId: 'KH001',
      customerName: 'Vũ Thị Lan',
      email: 'vuthilan@email.com',
      phone: '0123-456-789',
      bookingDate: '2025-01-15',
      status: 'Đang Chờ',
      services: ['Xét Nghiệm HIV', 'Xét Nghiệm Chlamydia'],
      paymentCode: 'TT001',
      staffId: 'NV001'
    },
    {
      id: 2,
      customerId: 'KH002',
      customerName: 'Đặng Văn Nam',
      email: 'dangvannam@email.com',
      phone: '0987-654-321',
      bookingDate: '2025-01-16',
      status: 'Đang Thực Hiện',
      services: ['Xét Nghiệm Giang Mai'],
      paymentCode: 'TT002',
      staffId: 'NV001'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('schedule'); // 'schedule' or 'test'

  const [newSchedule, setNewSchedule] = useState({
    customerName: '',
    email: '',
    consultantName: '',
    date: '',
    startTime: '',
    endTime: '',
    service: '',
    duration: '60'
  });



  const [newTestOrder, setNewTestOrder] = useState({
    customerName: '',
    email: '',
    phone: '',
    bookingDate: '',
    services: [],
    paymentCode: ''
  });

  const consultants = ['BS. Trần Thị Hoa', 'ThS. Phạm Văn Cường', 'BS. Nguyễn Thị Mai', 'ThS. Lê Văn Tùng'];
  const services = ['Tư vấn tổng quát', 'Tư vấn chuyên khoa', 'Tái khám', 'Tư vấn khẩn cấp'];
  const availableTests = ['Xét Nghiệm HIV', 'Xét Nghiệm Lậu', 'Xét Nghiệm Chlamydia', 'Xét Nghiệm Giang Mai'];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'đang chờ':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
      case 'đang thực hiện':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
      case 'đã hoàn thành':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
      case 'đã hủy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'đã hoàn thành':
        return React.createElement(CheckCircle, { className: "w-3 h-3" });
      case 'cancelled':
      case 'đã hủy':
        return React.createElement(XCircle, { className: "w-3 h-3" });
      default:
        return React.createElement(Clock, { className: "w-3 h-3" });
    }
  };

  // CRUD Functions for Schedules
  const handleCreateSchedule = () => {
    if (newSchedule.customerName && newSchedule.email && newSchedule.date) {
      const schedule = {
        id: schedules.length + 1,
        ...newSchedule,
        status: 'scheduled',
        duration: newSchedule.duration + ' phút'
      };
      setSchedules(prev => [...prev, schedule]);
      setNewSchedule({
        customerName: '',
        email: '',
        consultantName: '',
        date: '',
        startTime: '',
        endTime: '',
        service: '',
        duration: '60'
      });
      setShowCreateModal(false);
      alert('Lịch hẹn đã được tạo thành công!');
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  };

  const handleEditSchedule = () => {
    if (selectedItem.customerName && selectedItem.email && selectedItem.date) {
      setSchedules(prev => prev.map(item =>
        item.id === selectedItem.id ? selectedItem : item
      ));
      setShowEditModal(false);
      setSelectedItem(null);
      alert('Lịch hẹn đã được cập nhật thành công!');
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      setSchedules(prev => prev.filter(item => item.id !== id));
      alert('Lịch hẹn đã được xóa thành công!');
    }
  };

  // CRUD Functions for Test Orders
  const handleCreateTestOrder = () => {
    if (newTestOrder.customerName && newTestOrder.email && newTestOrder.bookingDate && newTestOrder.services.length > 0) {
      const testOrder = {
        id: testOrders.length + 1,
        customerId: `KH${String(testOrders.length + 1).padStart(3, '0')}`,
        ...newTestOrder,
        status: 'Đang Chờ',
        staffId: 'NV001'
      };
      setTestOrders(prev => [...prev, testOrder]);
      setNewTestOrder({
        customerName: '',
        email: '',
        phone: '',
        bookingDate: '',
        services: [],
        paymentCode: ''
      });
      setShowCreateModal(false);
      alert('Đơn xét nghiệm đã được tạo thành công!');
    } else {
      alert('Vui lòng điền đầy đủ thông tin và chọn ít nhất một dịch vụ!');
    }
  };

  const handleEditTestOrder = () => {
    if (selectedItem.customerName && selectedItem.email && selectedItem.bookingDate) {
      setTestOrders(prev => prev.map(item =>
        item.id === selectedItem.id ? selectedItem : item
      ));
      setShowEditModal(false);
      setSelectedItem(null);
      alert('Đơn xét nghiệm đã được cập nhật thành công!');
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  };

  const handleDeleteTestOrder = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn xét nghiệm này?')) {
      setTestOrders(prev => prev.filter(item => item.id !== id));
      alert('Đơn xét nghiệm đã được xóa thành công!');
    }
  };

  const handleServiceToggle = (service) => {
    if (modalType === 'test' && showCreateModal) {
      setNewTestOrder(prev => ({
        ...prev,
        services: prev.services.includes(service)
          ? prev.services.filter(s => s !== service)
          : [...prev.services, service]
      }));
    } else if (modalType === 'test' && showEditModal && selectedItem) {
      setSelectedItem(prev => ({
        ...prev,
        services: prev.services.includes(service)
          ? prev.services.filter(s => s !== service)
          : [...prev.services, service]
      }));
    }
  };

  const updateStatus = (id, newStatus, type) => {
    if (type === 'schedule') {
      setSchedules(prev => prev.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } else {
      setTestOrders(prev => prev.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
    }
    alert('Trạng thái đã được cập nhật!');
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.consultantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTestOrders = testOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase().replace(' ', '') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayAppointments = schedules.filter(s => s.date === '2025-01-15').length;
  const activePatients = [...new Set([...schedules.map(s => s.customerName), ...testOrders.map(t => t.customerName)])].length;
  const pendingTests = testOrders.filter(t => t.status === 'Đang Chờ').length;

  const [user, setUser] = useState({ name: "", roleName: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Hàm logout
  const handleLogout = () => {
    // Nếu bạn dùng sessionStorage
    sessionStorage.clear();  // hoặc sessionStorage.removeItem('userSessionKey')
    localStorage.clear();
    // Nếu bạn cần gọi API backend để logout (hủy session server)
    // fetch('/api/logout', { method: 'POST' }).then(() => {
    //   window.location.href = '/login';
    // });

    // Chuyển về trang đăng nhập
    window.location.href = '/login';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Bảng Điều Khiển Nhân Viên
                </h1>
                <p className="text-sm text-gray-500">Hệ Thống Quản Lý Y Tế</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button> */}
              <div className="flex items-center space-x-3">
                <div className="text-right leading-tight">
                  <p className="h-2 text-sm font-medium text-gray-900">BS. {user.name}</p>
                  <p className="text-xs text-gray-500">Nhân Viên Y Tế</p>
                </div>

                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">M</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-sm font-bold hover:bg-green-600"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Tổng Quan', icon: BarChart3 },
              { id: 'schedules', label: 'Lịch Tư Vấn', icon: Calendar },
              { id: 'tests', label: 'Quản Lý Xét Nghiệm STI', icon: TestTube }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Cuộc Hẹn Hôm Nay</p>
                    <p className="text-3xl font-bold text-gray-900">{todayAppointments}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-2">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% so với hôm qua
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Bệnh Nhân Đang Điều Trị</p>
                    <p className="text-3xl font-bold text-gray-900">{activePatients}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-2">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8% tuần này
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Xét Nghiệm Chờ Xử Lý</p>
                    <p className="text-3xl font-bold text-gray-900">{pendingTests}</p>
                    <p className="text-xs text-amber-600 flex items-center mt-2">
                      <Activity className="w-3 h-3 mr-1" />
                      Cần xử lý
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Schedules */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Lịch Hẹn Gần Đây</h3>
                    <button
                      onClick={() => setActiveTab('schedules')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {schedules.slice(0, 3).map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{schedule.customerName}</p>
                          <p className="text-sm text-gray-500">{schedule.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{schedule.date}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                          {getStatusIcon(schedule.status)}
                          <span className="ml-1 capitalize">{schedule.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Test Orders */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Đơn Xét Nghiệm Gần Đây</h3>
                    <button
                      onClick={() => setActiveTab('tests')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {testOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <TestTube className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{order.bookingDate}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản Lý Lịch Tư Vấn</h2>
                <p className="text-gray-600">Quản lý cuộc hẹn và tư vấn</p>
              </div>
              <button
                onClick={() => {
                  setModalType('schedule');
                  setShowCreateModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo Lịch Hẹn</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm khách hàng, tư vấn viên hoặc dịch vụ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="all">Tất Cả Trạng Thái</option>
                    <option value="scheduled">Đã Lên Lịch</option>
                    <option value="confirmed">Đã Xác Nhận</option>
                    <option value="completed">Đã Hoàn Thành</option>
                    <option value="cancelled">Đã Hủy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schedules Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tư Vấn Viên</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch Vụ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày & Giờ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-200">
                    {filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{schedule.customerName}</div>
                              <div className="text-sm text-gray-500">{schedule.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.consultantName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{schedule.service}</div>
                          <div className="text-sm text-gray-500">{schedule.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{schedule.date}</div>
                          <div className="text-sm text-gray-500">{schedule.startTime} - {schedule.endTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                            {getStatusIcon(schedule.status)}
                            <span className="ml-1 capitalize">{schedule.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => {
                                setSelectedItem(schedule);
                                setModalType('schedule');
                                setShowDetailModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(schedule);
                                setModalType('schedule');
                                setShowEditModal(true);
                              }}
                              className="text-emerald-600 hover:text-emerald-900 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STI Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản Lý Xét Nghiệm STI</h2>
                <p className="text-gray-600">Quản lý đơn xét nghiệm và thông tin bệnh nhân</p>
              </div>
              <button
                onClick={() => {
                  setModalType('test');
                  setShowCreateModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm Đơn Xét Nghiệm</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên khách hàng, mã hoặc số điện thoại..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="all">Tất Cả Trạng Thái</option>
                    <option value="đang chờ">Đang Chờ</option>
                    <option value="đang thực hiện">Đang Thực Hiện</option>
                    <option value="đã hoàn thành">Đã Hoàn Thành</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Test Orders Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Xét Nghiệm</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch Vụ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-200">
                    {filteredTestOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                              <div className="text-sm text-gray-500">{order.customerId}</div>
                              <div className="text-xs text-gray-400">{order.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {order.bookingDate}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {order.services.map((service, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => {
                                setSelectedItem(order);
                                setModalType('test');
                                setShowDetailModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(order);
                                setModalType('test');
                                setShowEditModal(true);
                              }}
                              className="text-emerald-600 hover:text-emerald-900 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTestOrder(order.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {modalType === 'schedule' ? 'Tạo Lịch Hẹn Mới' : 'Thêm Đơn Xét Nghiệm Mới'}
            </h3>

            {modalType === 'schedule' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={newSchedule.customerName}
                      onChange={(e) => setNewSchedule({ ...newSchedule, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên khách hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newSchedule.email}
                      onChange={(e) => setNewSchedule({ ...newSchedule, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="khachhang@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tư Vấn Viên</label>
                    <select
                      value={newSchedule.consultantName}
                      onChange={(e) => setNewSchedule({ ...newSchedule, consultantName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Tư Vấn Viên</option>
                      {consultants.map(consultant => (
                        <option key={consultant} value={consultant}>{consultant}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dịch Vụ</label>
                    <select
                      value={newSchedule.service}
                      onChange={(e) => setNewSchedule({ ...newSchedule, service: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Dịch Vụ</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày *</label>
                    <input
                      type="date"
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Bắt Đầu</label>
                    <input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Kết Thúc</label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={newTestOrder.customerName}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập tên khách hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newTestOrder.email}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="khachhang@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={newTestOrder.phone}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0123-456-789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày Xét Nghiệm *</label>
                    <input
                      type="date"
                      value={newTestOrder.bookingDate}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, bookingDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Chọn Xét Nghiệm *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableTests.map((test) => (
                      <label key={test} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newTestOrder.services.includes(test)}
                          onChange={() => handleServiceToggle(test)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{test}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã Thanh Toán</label>
                  <input
                    type="text"
                    value={newTestOrder.paymentCode}
                    onChange={(e) => setNewTestOrder({ ...newTestOrder, paymentCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="TT001"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={modalType === 'schedule' ? handleCreateSchedule : handleCreateTestOrder}
                className={`px-6 py-3 rounded-xl text-white transition-colors ${modalType === 'schedule'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
              >
                {modalType === 'schedule' ? 'Tạo Lịch Hẹn' : 'Thêm Đơn Xét Nghiệm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {modalType === 'schedule' ? 'Chỉnh Sửa Lịch Hẹn' : 'Chỉnh Sửa Đơn Xét Nghiệm'}
            </h3>

            {modalType === 'schedule' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={selectedItem.customerName}
                      onChange={(e) => setSelectedItem({ ...selectedItem, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={selectedItem.email}
                      onChange={(e) => setSelectedItem({ ...selectedItem, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tư Vấn Viên</label>
                    <select
                      value={selectedItem.consultantName}
                      onChange={(e) => setSelectedItem({ ...selectedItem, consultantName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Tư Vấn Viên</option>
                      {consultants.map(consultant => (
                        <option key={consultant} value={consultant}>{consultant}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dịch Vụ</label>
                    <select
                      value={selectedItem.service}
                      onChange={(e) => setSelectedItem({ ...selectedItem, service: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Dịch Vụ</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày *</label>
                    <input
                      type="date"
                      value={selectedItem.date}
                      onChange={(e) => setSelectedItem({ ...selectedItem, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
                    <select
                      value={selectedItem.status}
                      onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="scheduled">Đã Lên Lịch</option>
                      <option value="confirmed">Đã Xác Nhận</option>
                      <option value="completed">Đã Hoàn Thành</option>
                      <option value="cancelled">Đã Hủy</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Bắt Đầu</label>
                    <input
                      type="time"
                      value={selectedItem.startTime}
                      onChange={(e) => setSelectedItem({ ...selectedItem, startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Kết Thúc</label>
                    <input
                      type="time"
                      value={selectedItem.endTime}
                      onChange={(e) => setSelectedItem({ ...selectedItem, endTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={selectedItem.customerName}
                      onChange={(e) => setSelectedItem({ ...selectedItem, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={selectedItem.email}
                      onChange={(e) => setSelectedItem({ ...selectedItem, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={selectedItem.phone}
                      onChange={(e) => setSelectedItem({ ...selectedItem, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày Xét Nghiệm *</label>
                    <input
                      type="date"
                      value={selectedItem.bookingDate}
                      onChange={(e) => setSelectedItem({ ...selectedItem, bookingDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
                    <select
                      value={selectedItem.status}
                      onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Đang Chờ">Đang Chờ</option>
                      <option value="Đang Thực Hiện">Đang Thực Hiện</option>
                      <option value="Đã Hoàn Thành">Đã Hoàn Thành</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã Thanh Toán</label>
                    <input
                      type="text"
                      value={selectedItem.paymentCode}
                      onChange={(e) => setSelectedItem({ ...selectedItem, paymentCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Chọn Xét Nghiệm</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableTests.map((test) => (
                      <label key={test} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItem.services.includes(test)}
                          onChange={() => handleServiceToggle(test)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{test}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={modalType === 'schedule' ? handleEditSchedule : handleEditTestOrder}
                className={`px-6 py-3 rounded-xl text-white transition-colors flex items-center space-x-2 ${modalType === 'schedule'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalType === 'schedule' ? 'Chi Tiết Lịch Hẹn' : 'Chi Tiết Đơn Xét Nghiệm'}
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Khách Hàng</p>
                  <p className="text-sm text-gray-900">{selectedItem.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-gray-900">{selectedItem.email}</p>
                </div>
                {selectedItem.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Số Điện Thoại</p>
                    <p className="text-sm text-gray-900">{selectedItem.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Ngày</p>
                  <p className="text-sm text-gray-900">{selectedItem.date || selectedItem.bookingDate}</p>
                </div>
                {selectedItem.consultantName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Tư Vấn Viên</p>
                    <p className="text-sm text-gray-900">{selectedItem.consultantName}</p>
                  </div>
                )}
                {selectedItem.service && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Dịch Vụ</p>
                    <p className="text-sm text-gray-900">{selectedItem.service}</p>
                  </div>
                )}
                {selectedItem.customerId && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Mã Khách Hàng</p>
                    <p className="text-sm text-gray-900">{selectedItem.customerId}</p>
                  </div>
                )}
                {selectedItem.paymentCode && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Mã Thanh Toán</p>
                    <p className="text-sm text-gray-900">{selectedItem.paymentCode}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Trạng Thái</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedItem.status)}`}>
                    {getStatusIcon(selectedItem.status)}
                    <span className="ml-1">{selectedItem.status}</span>
                  </span>
                </div>
              </div>

              {selectedItem.services && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Dịch Vụ/Xét Nghiệm</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.startTime && selectedItem.endTime && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Thời Gian</p>
                  <p className="text-sm text-gray-900">{selectedItem.startTime} - {selectedItem.endTime}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-3">Cập Nhật Trạng Thái</p>
                <div className="flex flex-wrap gap-2">
                  {modalType === 'schedule' ? (
                    <>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'scheduled', 'schedule')}
                        className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors border border-amber-200"
                      >
                        Đã Lên Lịch
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'confirmed', 'schedule')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors border border-blue-200"
                      >
                        Đã Xác Nhận
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'completed', 'schedule')}
                        className="px-3 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200 transition-colors border border-emerald-200"
                      >
                        Đã Hoàn Thành
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'Đang Chờ', 'test')}
                        className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors border border-amber-200"
                      >
                        Đang Chờ
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'Đang Thực Hiện', 'test')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors border border-blue-200"
                      >
                        Đang Thực Hiện
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'Đã Hoàn Thành', 'test')}
                        className="px-3 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200 transition-colors border border-emerald-200"
                      >
                        Đã Hoàn Thành
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
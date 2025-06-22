import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Users, MessageSquare, Bell, BarChart3, Calendar, Settings, Search, Filter, Edit, Eye, Ban, Check, X, Send, Plus, UserCheck, Clock, Wifi } from 'lucide-react';
=======
import { Users, MessageSquare, Bell, BarChart3, Calendar, Trash, Settings, Search, Filter, Edit, Eye, Ban, Check, X, Send, Plus, UserCheck, Clock, Wifi } from 'lucide-react';
import axios from 'axios';
import { useOnlineUsersSocket } from '../hooks/useOnlineUsersSocket';


>>>>>>> origin/An

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    content: '',
    status: 'active'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Thêm state này

  // Simulate real-time user activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new user login
      if (Math.random() > 0.7) {
        const newUsers = [
          'Michael Johnson', 'Sarah Wilson', 'David Chen', 'Emma Davis',
          'Alex Rodriguez', 'Lisa Thompson', 'James Miller', 'Maria Garcia'
        ];
        const roles = ['Khách hàng', 'Tư vấn viên'];
        const randomUser = {
          id: Date.now(),
          name: newUsers[Math.floor(Math.random() * newUsers.length)],
          email: `user${Date.now()}@example.com`,
          role: roles[Math.floor(Math.random() * roles.length)],
          roleid: Math.floor(Math.random() * 2) + 1,
          is_active: true,
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toLocaleString(),
          isOnline: true,
          loginTime: new Date().toLocaleString()
        };

        setUsers(prev => [randomUser, ...prev]);
        setOnlineUsers(prev => [randomUser, ...prev]);
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'login',
          user: randomUser.name,
          action: 'Người dùng đã đăng nhập',
          timestamp: new Date().toLocaleString(),
          role: randomUser.role
        }, ...prev.slice(0, 9)]);
      }

      // Simulate user logout
      if (Math.random() > 0.8 && onlineUsers.length > 0) {
        const userToLogout = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
        setOnlineUsers(prev => prev.filter(u => u.id !== userToLogout.id));
        setUsers(prev => prev.map(u => u.id === userToLogout.id ? { ...u, isOnline: false } : u));
        setRecentActivity(prev => [{
          id: Date.now(),
          type: 'logout',
          user: userToLogout.name,
          action: 'Người dùng đã đăng xuất',
          timestamp: new Date().toLocaleString(),
          role: userToLogout.role
        }, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [onlineUsers]);

  // Mock data with online status
<<<<<<< HEAD
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Khách hàng', roleid: 1, is_active: true, joinDate: '2024-01-15', lastLogin: '2024-06-02', isOnline: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Tư vấn viên', roleid: 2, is_active: true, joinDate: '2024-02-20', lastLogin: '2024-06-01', isOnline: true },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Quản trị viên', roleid: 3, is_active: true, joinDate: '2024-01-10', lastLogin: '2024-06-03', isOnline: false },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Khách hàng', roleid: 1, is_active: false, joinDate: '2024-03-05', lastLogin: '2024-05-15', isOnline: false },
  ]);

  // Initialize online users
  useEffect(() => {
    setOnlineUsers(users.filter(user => user.isOnline));
    setRecentActivity([
      { id: 1, type: 'login', user: 'John Doe', action: 'Người dùng đã đăng nhập', timestamp: '2024-06-03 10:45', role: 'Khách hàng' },
      { id: 2, type: 'activity', user: 'Jane Smith', action: 'Bắt đầu tư vấn', timestamp: '2024-06-03 10:30', role: 'Tư vấn viên' },
      { id: 3, type: 'login', user: 'Mike Johnson', action: 'Người dùng đã đăng nhập', timestamp: '2024-06-03 10:15', role: 'Khách hàng' },
    ]);
  }, []);
=======

  // Initialize online users
  useEffect(() => {
  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!storedUser) {
    console.warn("Không có user trong localStorage/sessionStorage");
    return;
  }

  let token = null;
  try {
    const parsedUser = JSON.parse(storedUser);
    token = parsedUser.token;
  } catch (e) {
    console.error("Lỗi parse user:", e);
    return;
  }

  if (!token) {
    console.warn("Không có token trong user object");
    return;
  }

  axios.get("http://localhost:8080/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }
  })
    .then((res) => {
      console.log("Phản hồi từ server:", res.data);
      const fetchedUsers = res.data;
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers); // ✅ Giữ nguyên
        // ❌ BỎ DÒNG NÀY:
        // setOnlineUsers(fetchedUsers.filter(user => user.online));
      } else {
        console.error("API trả về không phải mảng:", fetchedUsers);
      }
    })
    .catch((err) => {
      console.error("Lỗi khi lấy dữ liệu user:", err);
    });
}, []);


useOnlineUsersSocket((realtimeOnlineUsers) => {
  console.log("🟢 Danh sách online từ socket:", realtimeOnlineUsers);
  setOnlineUsers(realtimeOnlineUsers);

  // Cập nhật lại trạng thái online cho mỗi user trong danh sách
  setUsers((prevUsers) => {
  const updated = prevUsers.map((u) => ({
    ...u,
    isOnline: realtimeOnlineUsers.some((ou) => ou.userId === u.userId),
  }));
  console.log("📌 User sau khi cập nhật online:", updated);
  return updated;
});

});
>>>>>>> origin/An

  const messages = [
    { id: 1, sender: 'John Doe', recipient: 'Jane Smith', content: 'Tôi cần hỗ trợ về việc đặt lịch của mình', timestamp: '2024-06-03 10:30', type: 'booking' },
    { id: 2, sender: 'Alice Brown', recipient: 'Hỗ trợ', content: 'Khi nào thì buổi tư vấn của tôi?', timestamp: '2024-06-03 09:15', type: 'consultation' },
    { id: 3, sender: 'Hệ thống', recipient: 'Tất cả người dùng', content: 'Bảo trì hệ thống được lên lịch tối nay', timestamp: '2024-06-02 16:00', type: 'notification' },
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Bảo trì hệ thống', content: 'Bảo trì theo lịch trình tối nay từ 23:00 đến 01:00 sáng', status: 'active', created: '2024-06-02', lastSent: '2024-06-02 16:00' },
    { id: 2, title: 'Ra mắt tính năng mới', content: 'Hãy xem các tính năng hệ thống đặt lịch mới của chúng tôi', status: 'hidden', created: '2024-06-01', lastSent: null },
    { id: 3, title: 'Giờ làm việc ngày lễ', content: 'Cập nhật giờ làm việc cho cuối tuần lễ sắp tới', status: 'active', created: '2024-05-30', lastSent: '2024-05-30 10:00' },
  ]);

  const stats = {
    totalUsers: users.length,
    onlineUsers: onlineUsers.length,
    ongoingConsultations: 23,
    completedConsultations: 156,
    totalBookings: 342,
    activeServices: 8,
    messagesSent: 1834,
    messagesReceived: 1756
  };

  const filteredUsers = users.filter(user =>
    userFilter === 'all' || user.role.toLowerCase() === userFilter
  );

  const filteredMessages = messages.filter(message =>
    messageFilter === 'all' || message.type === messageFilter
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tổng quan Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <Wifi className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Người dùng trực tuyến</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onlineUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tư vấn đang diễn ra</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ongoingConsultations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số lượt đặt lịch</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Online Users Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Hiện đang trực tuyến</h3>
            <span className="flex items-center text-green-600">
              <Wifi className="h-4 w-4 mr-1" />
              {onlineUsers.length} người dùng
            </span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.role}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Trực tuyến</p>
                  <p>{user.loginTime || user.lastLogin}</p>
                </div>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <p className="text-center text-gray-500 py-4">Không có người dùng nào đang trực tuyến</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động người dùng gần đây</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className={`flex items-center p-3 border-l-4 border-blue-200 bg-blue-50 rounded`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                  activity.type === 'login' ? 'bg-green-100' :
                  activity.type === 'logout' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'login' ? (
                    <UserCheck className="h-4 w-4 text-green-600" />
                  ) : activity.type === 'logout' ? (
                    <X className="h-4 w-4 text-red-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp} • {activity.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
=======
      
>>>>>>> origin/An

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tư vấn đã hoàn thành</h3>
          <p className="text-3xl font-bold text-green-600">{stats.completedConsultations}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tin nhắn đã gửi</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.messagesSent}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tin nhắn đã nhận</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.messagesReceived}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Báo cáo & Hoạt động gần đây</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Số lượng đăng ký người dùng mới trong tuần này: 24</span>
            <span className="text-xs text-gray-500">Cập nhật 2 giờ trước</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Tỷ lệ hoàn thành tư vấn: 94.2%</span>
            <span className="text-xs text-gray-500">Cập nhật 4 giờ trước</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Thời gian phản hồi trung bình: 12 phút</span>
            <span className="text-xs text-gray-500">Cập nhật 1 giờ trước</span>
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <div className="flex space-x-4">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="consultant">Tư vấn viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần đăng nhập cuối</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.isOnline && (
                          <div className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'Quản trị viên' ? 'bg-red-100 text-red-800' :
                    user.role === 'Tư vấn viên' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
<<<<<<< HEAD
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
=======
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
>>>>>>> origin/An
                    </span>
                    {user.isOnline ? (
  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full mt-1 w-fit">
    <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></div>
    Trực tuyến
  </span>
) : (
  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full mt-1 w-fit">
    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-1"></div>
    Ngoại tuyến
  </span>
)}

                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </button>
                  {/* <button className="text-green-600 hover:text-green-900">
                    <Eye className="h-4 w-4 inline" />
<<<<<<< HEAD
                  </button>
                  <button className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                    {user.is_active ? <Ban className="h-4 w-4 inline" /> : <Check className="h-4 w-4 inline" />}
=======
                  </button> */}
                  <button className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                    {user.isActive ? <Ban className="h-4 w-4 inline" /> : <Check className="h-4 w-4 inline" />}
>>>>>>> origin/An
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-red-900"
                    title="Xóa tài khoản"
                  >
                    <Trash className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng: {selectedUser.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  defaultValue={selectedUser.name}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <select
                  defaultValue={selectedUser.role}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Khách hàng">Khách hàng</option>
                  <option value="Tư vấn viên">Tư vấn viên</option>
                  <option value="Quản trị viên">Quản trị viên</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={selectedUser.is_active}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Tài khoản hoạt động</label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Thông tin người dùng</h2>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

  const MessagingPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý tin nhắn</h2>
        <select
          value={messageFilter}
          onChange={(e) => setMessageFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả tin nhắn</option>
          <option value="booking">Đặt lịch</option>
          <option value="consultation">Tư vấn</option>
          <option value="notification">Thông báo</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Tin nhắn trò chuyện</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{message.sender}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-gray-700">{message.recipient}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                      message.type === 'consultation' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {message.type}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-800">{message.content}</p>
                  <p className="mt-1 text-sm text-gray-500">{message.timestamp}</p>
                </div>
                <div className="flex space-x-2">
                  {/* <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="h-4 w-4" />
                  </button> */}
                  <button className="text-red-600 hover:text-red-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NotificationPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý thông báo</h2>
        <button
          onClick={() => {
            setEditingNotification(null); // Clear any existing editing state
            setNotificationForm({ title: '', content: '', status: 'active' });
            setShowNotificationModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thông báo mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Thông báo hiện hành</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notification.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{notification.content}</p>
                  <p className="mt-1 text-sm text-gray-500">Đã tạo: {notification.created}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    <Send className="h-3 w-3 mr-1" />
                    Gửi
                  </button>
                  <button className={`px-3 py-1 text-sm rounded ${
                    notification.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                    onClick={() => { /* Toggle status logic here */ }}
                  >
                    {notification.status === 'active' ? 'Ẩn' : 'Hiển thị'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingNotification(notification);
                      setNotificationForm({
                        title: notification.title,
                        content: notification.content,
                        status: notification.status
                      });
                      setShowNotificationModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(notification.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Modal (Add/Edit) */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingNotification ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                <textarea
                  value={notificationForm.content}
                  onChange={(e) => setNotificationForm({ ...notificationForm, content: e.target.value })}
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  value={notificationForm.status}
                  onChange={(e) => setNotificationForm({ ...notificationForm, status: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Logic to save or update notification
                  setShowNotificationModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-700">Bạn có chắc chắn muốn xóa thông báo này không?</p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setNotifications(notifications.filter(n => n.id !== showDeleteConfirm));
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

<<<<<<< HEAD
=======
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


  const handleSaveChanges = async () => {
    const userId = selectedUser?.userId;

    if (!userId) {
      alert("Thiếu thông tin người dùng để cập nhật");
      return;
    }

    const form = document.getElementById("editUserForm");
    const formData = new FormData(form);

    const updateData = {
      name: formData.get("name"),
      email: formData.get("email"),
      roleName: formData.get("roleName"),
      isActive: selectedUser.isActive
    };
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        alert("Token không tồn tại, vui lòng đăng nhập lại.");
        return;
      }

      await axios.put(
        `/api/admin/users/${userId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      alert("Cập nhật thành công!");
      setSelectedUser(null);
    }  catch (error) {
  console.error("Lỗi khi cập nhật:", error);

  const status = error.response?.status;
  const message = error.response?.data;

  if (status === 400 && message === "Không thể chỉnh sửa chính bạn") {
    alert("Bạn không thể chỉnh sửa chính mình.");
  } else {
    const fallbackMessage =
      message?.message || error.message || "Cập nhật thất bại";
    alert("Lỗi khi cập nhật: " + fallbackMessage);
  }
}

  };


  const handleEditUser = (user) => {
    setSelectedUser({
      ...user,
      isActive: Boolean(user.isActive) // Ensure it's a boolean
    });
  };
  const handleDeleteUser = async (user) => {
  const confirmed = window.confirm(`Bạn có chắc muốn xóa ${user.name}?`);
  if (!confirmed) return;

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

    if (!token) {
      alert("Không tìm thấy token, vui lòng đăng nhập lại.");
      return;
    }

    await axios.delete(`/api/admin/users/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Xóa thành công!");
    // cập nhật danh sách nếu cần
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    const msg = error.response?.data?.message || "Không thể xóa người dùng.";
    alert(msg);
  }
};

  // Update checkbox handler
  const handleCheckboxChange = (e) => {
    setSelectedUser(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

>>>>>>> origin/An
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển quản trị</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Chào mừng, Admin</span>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Người dùng
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'messages'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Tin nhắn
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'notifications'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Bell className="h-4 w-4 mr-2" />
              Thông báo
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'messages' && <MessagingPanel />}
        {activeTab === 'notifications' && <NotificationPanel />}
      </div>
    </div>
  );
};

export default AdminDashboard;
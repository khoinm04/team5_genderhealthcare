import React from 'react';
import { useOnlineUsersSocket } from '../../hooks/useOnlineUsersSocket';



import {
  Users,
  UserCheck,
  Wrench,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

const Sidebar = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
    { id: 'staff', label: 'Quản lý nhân viên', icon: Users },
    { id: 'consultants', label: 'Quản lý tư vấn viên', icon: UserCheck },
    { id: 'services', label: 'Quản lý dịch vụ', icon: Wrench },
    { id: 'schedules', label: 'Lịch làm việc', icon: Calendar },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];
    const { deactivateClient } = useOnlineUsersSocket(() => {});
  
  const handleLogout = async () => {
  await deactivateClient(); // 👈 Đảm bảo gửi tín hiệu offline và đóng kết nối
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/login';
};


  return (
    <div className={`
      bg-white shadow-lg transition-all duration-300 h-screen flex flex-col
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800">Manager Dashboard</h1>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <Icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center px-3 py-3 rounded-lg transition-colors
            text-red-600 hover:bg-red-50
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          <LogOut size={20} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
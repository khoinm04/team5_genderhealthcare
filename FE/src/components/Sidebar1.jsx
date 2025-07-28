import React from 'react';
import {
  Home,
  FileText,
  Calendar,
  Video,
  X
} from 'lucide-react';

const Sidebar1 = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: Home },
    { id: 'blog', label: 'Quản lý Blog', icon: FileText },
    { id: 'schedule', label: 'Lịch trình', icon: Calendar },
    { id: 'consultation', label: 'Tư vấn trực tuyến', icon: Video },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Tư vấn viên</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                // Nếu bạn dùng React Router, chuyển hướng về trang đăng nhập:
                window.location.href = "/login"; // hoặc dùng `navigate("/login")` nếu dùng `react-router-dom`
              }}
              className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">⎋</span>
              </div>
              <div>
                <p className="font-medium text-red-600">Đăng xuất</p>
                <p className="text-sm text-red-400">Thoát khỏi hệ thống</p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar1;
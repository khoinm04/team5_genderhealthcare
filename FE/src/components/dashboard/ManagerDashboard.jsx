import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import StaffManagement from './StaffManagement';
import ConsultantManagement from './ConsultantManagement';
import ServiceManagement from './ServiceManagement';
import ScheduleManagement from './ScheduleManagement';

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'staff':
        return <StaffManagement />;
      case 'consultants':
        return <ConsultantManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'schedules':
        return <ScheduleManagement />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600 mt-1">Cấu hình hệ thống và tùy chọn cá nhân</p>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Trang cài đặt đang được phát triển...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default ManagerDashboard;
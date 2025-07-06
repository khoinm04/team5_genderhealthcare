import React, { useState } from 'react';
import Sidebar from './SlidebarConsultant';
import Dashboard from './DashboardConsultant';
import BlogManagement from './BlogManagement';
import ScheduleManagement from './ScheduleManagementC';
import OnlineConsultation from './OnlineConsultation';

function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'blog':
        return <BlogManagement />;
      case 'schedule':
        return <ScheduleManagement />;
      case 'consultation':
        return <OnlineConsultation />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default ConsultantDashboard;
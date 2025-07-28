import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  Users,
  Calendar,
  Clock,
  DollarSign,
  ArrowRight
} from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const [consultantName, setConsultantName] = useState("...");

  const stats = [
    
  ];

  const recentActivities = [
    
  ];

  const quickActions = [
    {
      title: 'Tạo bài viết Blog',
      description: 'Viết và xuất bản nội dung mới',
      action: () => setActiveTab('blog'),
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Quản lý lịch trình',
      description: 'Xem và cập nhật lịch của bạn',
      action: () => setActiveTab('schedule'),
      icon: Calendar,
      color: 'bg-teal-500'
    },
    {
      title: 'Tư vấn trực tuyến',
      description: 'Bắt đầu buổi tư vấn video',
      action: () => setActiveTab('consultation'),
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-lg font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600 text-lg">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="relative bg-white rounded-[2rem] shadow-lg border border-gray-100 flex flex-col items-start p-10 transition-all hover:shadow-xl hover:-translate-y-1 group min-h-[280px]"
                >
                  {/* Icon Badge */}
                  <div className={`absolute top-6 left-6 rounded-xl p-3 ${action.color} shadow-md flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div><div className="mt-16 flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{action.title}</h3>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">{action.description}</p>
                  </div>
                  <button
                    onClick={action.action}
                    className="mt-auto text-blue-600 font-semibold text-lg flex items-center gap-2 hover:underline focus:outline-none transition-all"
                  >
                    Bắt đầu <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;
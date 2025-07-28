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
    {
      title: 'Tổng khách hàng',
      value: '124',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },


    {
      title: 'Bài viết blog',
      value: '28',
      change: '+5 tháng này',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      type: 'consultation',
      title: 'Tư vấn với chị Nguyễn Thị Hoa',
      time: '2 giờ trước',
      status: 'hoàn thành'
    },
    {
      type: 'blog',
      title: 'Bài viết blog mới được xuất bản',
      time: '4 giờ trước',
      status: 'đã xuất bản'
    },
    {
      type: 'schedule',
      title: 'Lịch trình ngày mai đã cập nhật',
      time: '6 giờ trước',
      status: 'đã cập nhật'
    },
    {
      type: 'consultation',
      title: 'Buổi tư vấn với anh Trần Văn Nam',
      time: '1 ngày trước',
      status: 'hoàn thành'
    }
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
useEffect(() => {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!userStr || !token) return;

  try {
    const { userId, name } = JSON.parse(userStr);
    if (!userId) return;

    axios.get(`/api/consultations/consultant/${userId}/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setConsultantName(name || "Không rõ"))
    .catch(() => setConsultantName("Không rõ"));
  } catch (err) {
    console.error("Lỗi parse user từ localStorage:", err);
  }
}, []);


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Chào mừng trở lại, {consultantName}!</h1>
      </div>

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
                  </div>
                  <div className="mt-16 flex-1">
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

          {/* Today's Schedule */}
          {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch trình hôm nay</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Buổi tư vấn chiến lược Marketing</p>
                    <p className="text-sm text-gray-600">với anh Lê Văn Thành</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">10:00 SA</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-gray-900">Cuộc gọi lập kế hoạch kinh doanh</p>
                    <p className="text-sm text-gray-600">với chị Phạm Thị Mai</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-teal-600">2:30 CH</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Họp đánh giá nhóm</p>
                    <p className="text-sm text-gray-600">Đồng bộ nhóm nội bộ</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-orange-600">4:00 CH</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hoạt động gần đây</h2>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-base">{activity.title}</p>
                    <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${activity.status === 'hoàn thành' ? 'bg-green-100 text-green-800' :
                    activity.status === 'đã xuất bản' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'chưa đọc' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
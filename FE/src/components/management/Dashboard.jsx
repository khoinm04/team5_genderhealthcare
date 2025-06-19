import React from 'react';
import { Users, UserCheck, Wrench, TrendingUp, Calendar, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Tổng nhân viên',
      value: '24',
      change: '+2 từ tháng trước',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Tư vấn viên hoạt động',
      value: '12',
      change: '+1 từ tháng trước',
      icon: UserCheck,
      color: 'bg-emerald-500'
    },
    {
      title: 'Dịch vụ đang cung cấp',
      value: '8',
      change: 'Không thay đổi',
      icon: Wrench,
      color: 'bg-purple-500'
    },
    {
      title: 'Doanh thu tháng này',
      value: '45.2M',
      change: '+12% từ tháng trước',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Nhân viên mới được thêm',
      detail: 'Trần Văn B đã được thêm vào phòng Kỹ thuật',
      time: '2 giờ trước',
      type: 'staff'
    },
    {
      id: 2,
      action: 'Lịch tư vấn được đặt',
      detail: 'Dr. Phạm Thị Dung có lịch tư vấn lúc 14:00',
      time: '4 giờ trước',
      type: 'schedule'
    },
    {
      id: 3,
      action: 'Dịch vụ được cập nhật',
      detail: 'Giá dịch vụ "Tư vấn đầu tư" đã được điều chỉnh',
      time: '1 ngày trước',
      type: 'service'
    }
  ];

  const upcomingSchedules = [
    {
      id: 1,
      consultant: 'Dr. Phạm Thị Dung',
      client: 'Nguyễn Văn A',
      service: 'Tư vấn đầu tư',
      time: '09:00 - 10:00',
      date: 'Hôm nay'
    },
    {
      id: 2,
      consultant: 'ThS. Hoàng Văn Em',
      client: 'Công ty XYZ',
      service: 'Tư vấn pháp lý',
      time: '14:00 - 15:30',
      date: 'Hôm nay'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-1">Chào mừng trở lại! Đây là bảng điều khiển của bạn</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hôm nay</p>
          <p className="text-lg font-semibold">{new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`
                  p-2 rounded-full
                  ${activity.type === 'staff' ? 'bg-blue-100 text-blue-600' : ''}
                  ${activity.type === 'schedule' ? 'bg-emerald-100 text-emerald-600' : ''}
                  ${activity.type === 'service' ? 'bg-purple-100 text-purple-600' : ''}
                `}>
                  {activity.type === 'staff' && <Users size={16} />}
                  {activity.type === 'schedule' && <Calendar size={16} />}
                  {activity.type === 'service' && <Wrench size={16} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedules */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lịch sắp tới</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Xem lịch đầy đủ
            </button>
          </div>
          <div className="space-y-4">
            {upcomingSchedules.map((schedule) => (
              <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{schedule.consultant}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {schedule.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Khách hàng: {schedule.client}</p>
                <p className="text-sm text-gray-600 mb-2">Dịch vụ: {schedule.service}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  {schedule.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
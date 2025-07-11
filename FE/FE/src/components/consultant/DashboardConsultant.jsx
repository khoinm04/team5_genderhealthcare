import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Clock,
  DollarSign,
  ArrowRight
} from 'lucide-react';

const DashboardConsultant = ({ setActiveTab }) => {
  const stats = [
    {
      title: 'Tổng khách hàng',
      value: '124',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Doanh thu tháng này',
      value: '312.500.000đ',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-teal-500'
    },
    {
      title: 'Buổi tư vấn sắp tới',
      value: '15',
      change: '7 ngày tới',
      icon: Calendar,
      color: 'bg-orange-500'
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại, Nguyễn Văn A!</h1>
        <p className="text-gray-600">Đây là những gì đang diễn ra với doanh nghiệp tư vấn của bạn hôm nay.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{action.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Bắt đầu <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Today's Schedule */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch trình hôm nay</h2>
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
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activity.status === 'hoàn thành' ? 'bg-green-100 text-green-800' :
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

export default DashboardConsultant;
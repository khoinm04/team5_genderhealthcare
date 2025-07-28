import React from 'react';
import { Users, UserCheck, Wrench, TrendingUp, Calendar, Clock, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const [statsData, setStatsData] = useState([]);
  const navigate = useNavigate();


  

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
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchStats = async () => {
  try {
    const [staffRes, consultantRes, serviceRes] = await Promise.all([
      fetch("http://localhost:8080/api/manager/total-staff", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:8080/api/manager/total-consultants", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:8080/api/manager/total-services", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const staffData = await staffRes.json();
    const consultantData = await consultantRes.json();
    const serviceData = await serviceRes.json();

    setStatsData([
      {
        title: "Tổng nhân viên",
        value: staffData.totalStaff,
        change: staffData.staffChange,
        icon: Users,
        color: "bg-blue-500"
      },
      {
        title: "Tổng tư vấn viên",
        value: consultantData.totalConsultant,
        change: consultantData.consultantChange,
        icon: UserCheck,
        color: "bg-green-500"
      },
      {
        title: "Dịch vụ đang cung cấp",
        value: serviceData.totalServices,
        change: serviceData.serviceChange,
        icon: Wrench,
        color: "bg-purple-500"
      }
    ]);
  } catch (err) {
    console.error("❌ Lỗi khi tải thống kê:", err);
  }
};


  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/manager/upcoming-schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("📅 upcomingSchedules từ API:", data);
      setUpcomingSchedules(data);
    } catch (err) {
      console.error("❌ Lỗi upcoming-schedules:", err);
    }
  };

  fetchStats();
  fetchSchedules();
}, []);


  // const upcomingSchedules = [
  //   {
  //     id: 1,
  //     consultant: 'Dr. Phạm Thị Dung',
  //     client: 'Nguyễn Văn A',
  //     service: 'Tư vấn đầu tư',
  //     time: '09:00 - 10:00',
  //     date: 'Hôm nay'
  //   },
  //   {
  //     id: 2,
  //     consultant: 'ThS. Hoàng Văn Em',
  //     client: 'Công ty XYZ',
  //     service: 'Tư vấn pháp lý',
  //     time: '14:00 - 15:30',
  //     date: 'Hôm nay'
  //   }
  // ];

 


  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-600">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-base text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={32} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="flex-1">
        {/* Recent Activities */}
        

        {/* Upcoming Schedules */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Lịch sắp tới</h2>
            <button 
            onClick={() => navigate("/manager/schedules")}
            className="text-blue-600 hover:text-blue-700 text-base font-medium">
              Xem lịch đầy đủ
            </button>
          </div>
          <div className="space-y-6">
            {upcomingSchedules.map((schedule) => (
              <div key={schedule.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {schedule.consultantName || schedule.staffName}
                  </h3>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium
                  ${schedule.consultantName ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {schedule.consultantName ? 'Tư vấn viên' : 'Nhân viên'}
                  </span>
                </div>
                <p className="text-base text-gray-600 mb-2">Khách hàng: {schedule.client}</p>
                <p className="text-base text-gray-600 mb-3">Dịch vụ: {schedule.serviceName}</p>
                <div className="flex items-center text-base text-gray-500">
                  <Clock size={16} className="mr-2" />
                  {schedule.date} - {schedule.startTime} đến {schedule.endTime}
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
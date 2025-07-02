import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CreditCard, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khởi tạo navigate

  // Load dữ liệu giả
  useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/bookings/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const transformed = response.data.map((item) => ({
        id: item.id,
        type: item.categoryType.toLowerCase(), // "CONSULTATION" => "consultation"
        title: item.serviceName,
        date: item.date,
time: item.timeSlot, // giữ nguyên toàn bộ chuỗi timeSlot
        doctor: item.assignedStaff || 'Chưa gán',
        status: item.status.toLowerCase(),
        price: item.price,
        notes: item.notes,
      }));

      setAppointments(transformed);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu từ API:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAppointments();
}, []);





  const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'text-green-600 bg-green-100';
    case 'scheduled':
    case 'confirmed':
    case 'rescheduled': return 'text-blue-600 bg-blue-100';
    case 'pending':
    case 'in_progress':
    case 'ongoing': return 'text-yellow-700 bg-yellow-100';
    case 'canceled':
    case 'cancelled': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};


  const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'scheduled': return 'Đã lên lịch';
    case 'rescheduled': return 'Đã dời lịch';
    case 'ongoing': return 'Đang thực hiện';
    case 'in_progress': return 'Đang xét nghiệm';
    case 'completed': return 'Hoàn thành';
    case 'canceled': // cả test lẫn consultation
    case 'cancelled': return 'Đã hủy';
    default: return 'Không xác định';
  }
};


  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filterAppointments = (appointment) => {
    if (filter === 'all') return true;
    if (filter === 'test') return appointment.type === 'test';
    if (filter === 'consultation') return appointment.type === 'consultation';
    return appointment.status === filter;
  };

  const filteredAppointments = appointments.filter(filterAppointments);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {

      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải lịch sử đặt lịch...</p>
        </div>
      </div>
    );
  }

  // Hàm xử lý điều hướng về trang chủ
  const handleBackToHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Back to Home Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
          <button
            onClick={handleBackToHome}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-base font-medium">Trang chủ</span>
          </button>
        </div>
      </div>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Lịch sử đặt lịch</h1>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('test')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'test'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              Xét nghiệm
            </button>
            <button
              onClick={() => setFilter('consultation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'consultation'
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              Tư vấn
            </button>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn nào</h3>
            <p className="text-gray-500">Bạn chưa có lịch hẹn nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {appointment.type === 'test' ? (
                            <FileText className="w-5 h-5 text-blue-600" />
                          ) : (
                            <User className="w-5 h-5 text-green-600" />
                          )}
                          <span className="text-sm font-medium text-gray-600">
                            {appointment.type === 'test' ? 'Xét nghiệm' : 'Tư vấn'}
                          </span>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`} >
                          {getStatusIcon(appointment.status)}
                          {getStatusText(appointment.status)}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {appointment.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">{formatPrice(appointment.price)}</span>
                        </div>
                      </div>



                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>Ghi chú:</strong> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {appointment.status === 'scheduled' && (
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                          Xem chi tiết
                        </button>
                      )}
                      {appointment.status === 'completed' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Xem kết quả
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  BarChart3,
  FileText,
  Edit,
  Eye,
  Check,
  X,
  Plus,
  MessageSquare,
  BookOpen,
  Star,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

const NoteModal = ({ appointment, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState('');

  // Chỉ update content khi modal mở và appointment thay đổi
  useEffect(() => {
    if (isOpen && appointment) {
      setContent(appointment.notes || '');
    }
  }, [isOpen, appointment?.id]);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl">
        <h3 className="text-lg font-semibold mb-4">
          Chỉnh sửa ghi chú - {appointment.clientName}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú tư vấn
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[200px]"
              placeholder="Nhập ghi chú về buổi tư vấn...&#10;&#10;Ví dụ:&#10;- Tình trạng khách hàng&#10;- Vấn đề chính được thảo luận&#10;- Kế hoạch điều trị&#10;- Lịch hẹn tiếp theo"
            />
            <div className="mt-2 text-xs text-gray-500">
              Ghi chú sẽ được lưu trữ an toàn và chỉ bạn mới có thể xem
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Lưu ghi chú
          </button>
        </div>
      </div>
    </div>
  );
};
const ConsultantDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');

  // Mock data for consultant
  const consultantStats = {
    totalConsultations: 156,
    todayAppointments: 8,
    completedToday: 5,
    averageRating: 4.8,
    totalBlogs: 23,
    blogViews: 12543,
    pendingAppointments: 12,
    monthlyRevenue: 15600000
  };

  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const consultantId = user?.userId;

        const response = await fetch(`/api/consultations/consultant/${consultantId}/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách lịch làm việc");
        }

        const data = await response.json();
        const consultations = data.consultations || [];

        const mappedAppointments = consultations.map((c) => ({
          id: c.consultationId,
          clientName: c.customerName,
          clientEmail: c.customerEmail,
          clientPhone: c.customerPhone || "",
          date: c.dateScheduled,
          time: c.timeSlot?.split("-")[0],
          timeSlot: c.timeSlot,
          service: c.serviceNames?.join(", "),
          status: c.status?.toLowerCase(),
          statusDescription: c.statusDescription,
          notes: c.note || "",
          topic: c.topic || "",
          updatedAt: c.updatedAt,

        }));

        setAppointments(mappedAppointments);
      } catch (error) {
        console.error("Lỗi khi tải lịch làm việc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);


  // const [appointments, setAppointments] = useState([
  //   {
  //     id: 1,
  //     clientName: 'Nguyễn Văn An',
  //     clientEmail: 'an.nguyen@email.com',
  //     date: '2024-12-20',
  //     time: '09:00',
  //     duration: '60 phút',
  //     service: 'Tư vấn tâm lý cá nhân',
  //     status: 'confirmed',
  //     notes: 'Khách hàng đang gặp vấn đề về lo âu trong công việc',
  //     clientPhone: '0123456789',
  //     sessionType: 'online'
  //   },
  //   {
  //     id: 2,
  //     clientName: 'Trần Thị Bình',
  //     clientEmail: 'binh.tran@email.com',
  //     date: '2024-12-20',
  //     time: '10:30',
  //     duration: '45 phút',
  //     service: 'Tư vấn hôn nhân gia đình',
  //     status: 'in-progress',
  //     notes: 'Buổi tư vấn lần 3, tiến triển tích cực',
  //     clientPhone: '0987654321',
  //     sessionType: 'offline'
  //   },
  //   {
  //     id: 3,
  //     clientName: 'Lê Hoàng Minh',
  //     clientEmail: 'minh.le@email.com',
  //     date: '2024-12-20',
  //     time: '14:00',
  //     duration: '60 phút',
  //     service: 'Tư vấn phát triển bản thân',
  //     status: 'pending',
  //     notes: '',
  //     clientPhone: '0456789123',
  //     sessionType: 'online'
  //   },
  //   {
  //     id: 4,
  //     clientName: 'Phạm Thu Hà',
  //     clientEmail: 'ha.pham@email.com',
  //     date: '2024-12-21',
  //     time: '09:30',
  //     duration: '90 phút',
  //     service: 'Tư vấn căng thẳng công việc',
  //     status: 'confirmed',
  //     notes: 'Khách hàng mới, cần đánh giá tổng thể',
  //     clientPhone: '0789123456',
  //     sessionType: 'offline'
  //   }
  // ]);

  // const [blogs, setBlogs] = useState([
  //   {
  //     id: 1,
  //     title: '5 Cách Quản Lý Căng Thẳng Hiệu Quả',
  //     excerpt: 'Khám phá những phương pháp đơn giản nhưng hiệu quả để giảm căng thẳng trong cuộc sống hàng ngày...',
  //     status: 'published',
  //     views: 2341,
  //     likes: 87,
  //     publishDate: '2024-12-15',
  //     category: 'Sức khỏe tâm lý'
  //   },
  //   {
  //     id: 2,
  //     title: 'Xây Dựng Mối Quan Hệ Tích Cực',
  //     excerpt: 'Hướng dẫn chi tiết về cách xây dựng và duy trì những mối quan hệ lành mạnh...',
  //     status: 'draft',
  //     views: 0,
  //     likes: 0,
  //     publishDate: null,
  //     category: 'Tâm lý xã hội'
  //   },
  //   {
  //     id: 3,
  //     title: 'Hiểu Về Trầm Cảm Và Cách Hỗ Trợ',
  //     excerpt: 'Những dấu hiệu nhận biết và cách hỗ trợ người thân đang gặp phải tình trạng trầm cảm...',
  //     status: 'published',
  //     views: 3567,
  //     likes: 156,
  //     publishDate: '2024-12-10',
  //     category: 'Rối loạn tâm lý'
  //   }
  // ]);

  const DashboardOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tổng quan Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng buổi tư vấn</p>
              <p className="text-2xl font-bold text-gray-900">{consultantStats.totalConsultations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lịch hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{consultantStats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">{consultantStats.averageRating}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bài blog đã viết</p>
              <p className="text-2xl font-bold text-gray-900">{consultantStats.totalBlogs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Hoàn thành hôm nay</h3>
          <p className="text-3xl font-bold text-green-600">{consultantStats.completedToday}</p>
        </div>
      </div>

      {/* Today's Schedule Preview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch hôm nay</h3>
        <div className="space-y-3">
          {appointments.filter(apt => apt.date === '2024-12-20').map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{appointment.time}</span>
                <span className="text-gray-600">{appointment.clientName}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {appointment.status === 'confirmed' ? 'Đã xác nhận' :
                    appointment.status === 'in-progress' ? 'Đang tư vấn' : 'Chờ xác nhận'}
                </span>
              </div>
              <span className="text-sm text-gray-500">{appointment.service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ScheduleManagement = () => {
    const handleStatusChange = async (appointmentId, newStatus) => {
      try {
        const token = localStorage.getItem("token");

        // Gọi API cập nhật status
        const response = await fetch(`/api/consultations/${appointmentId}/consultant/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Lỗi khi cập nhật trạng thái:", data.error);
          alert("Cập nhật trạng thái thất bại");
          return;
        }

        // ✅ Cập nhật lại UI nếu thành công
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        );
      } catch (error) {
        console.error("Lỗi mạng khi cập nhật trạng thái:", error);
        alert("Không thể kết nối đến máy chủ");
      }
    };


    const handleSaveNote = async () => {
      if (!selectedAppointment) return;

      try {
        const token = localStorage.getItem("token");
        const consultationId = selectedAppointment.id;

        // Gọi API cập nhật note
        const response = await fetch(`/api/consultations/${consultationId}/consultant/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note: noteContent }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Lỗi khi cập nhật:", data.error);
          alert("Cập nhật ghi chú thất bại.");
          return;
        }

        // ✅ Cập nhật lại UI nếu thành công
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === selectedAppointment.id
              ? { ...apt, notes: noteContent }
              : apt
          )
        );

        // ✅ Reset form
        setShowNoteModal(false);
        setSelectedAppointment(null);
        setNoteContent('');
      } catch (err) {
        console.error("Lỗi mạng:", err);
        alert("Không thể kết nối đến máy chủ.");
      }
    };
    const handleEditNote = (appointment) => {
      setSelectedAppointment(appointment);
      setShowNoteModal(true);
    };

    const handleCloseNoteModal = () => {
      setShowNoteModal(false);
      setSelectedAppointment(null);
    };



    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch làm việc</h2>
          <div className="text-sm text-gray-600">
            Tổng: {appointments.length} cuộc hẹn
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointment.clientName}</div>
                      <div className="text-sm text-gray-500">{appointment.clientEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.timeSlot}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.service}</div>
                    <div className={`text-sm ${appointment.sessionType === 'online' ? 'text-blue-600' : 'text-green-600'}`}>
                      {appointment.sessionType === 'online' ? 'Trực tuyến' : 'Trực tiếp'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.status?.toUpperCase()} // đảm bảo đúng định dạng Enum
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 font-medium border-0 ${appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                            appointment.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="ONGOING">Đang tư vấn</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELED">Đã hủy</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowNoteModal(false);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleEditNote(appointment)}
                      className="text-green-600 hover:text-green-900"
                      title="Chỉnh sửa ghi chú"
                    >
                      <Edit className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appointment Detail Modal */}
        {selectedAppointment && !showNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Chi tiết cuộc hẹn</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.clientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.clientEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.clientPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thời gian</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.date} - {selectedAppointment.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dịch vụ</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.service}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hình thức</label>
                  <p className="text-sm text-gray-900">
                    {selectedAppointment.sessionType === 'online' ? 'Tư vấn trực tuyến' : 'Tư vấn trực tiếp'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.notes || 'Chưa có ghi chú'}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Note Edit Modal */}
        {showNoteModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Chỉnh sửa ghi chú - {selectedAppointment.clientName}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú tư vấn</label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows="6"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[150px] overflow-y-auto"
                    placeholder="Nhập ghi chú về buổi tư vấn..."
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowNoteModal(false);
                    setSelectedAppointment(null);
                    setNoteContent('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Lưu ghi chú
                </button>
              </div>
            </div>
          </div>
        )}
        <NoteModal
          appointment={selectedAppointment}
          isOpen={showNoteModal}
          onClose={handleCloseNoteModal}
          onSave={handleSaveNote}
        />
      </div>
    );
  };

  const BlogManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Blog</h2>
        <button
          onClick={() => {
            // Navigate to blog creation page
            window.location.href = '/blog/create';
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm bài viết mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tổng bài viết</h3>
          <p className="text-3xl font-bold text-blue-600">{blogs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Đã xuất bản</h3>
          <p className="text-3xl font-bold text-green-600">{blogs.filter(b => b.status === 'published').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tổng lượt xem</h3>
          <p className="text-3xl font-bold text-purple-600">{blogs.reduce((sum, blog) => sum + blog.views, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Danh sách bài viết</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {blogs.map((blog) => (
            <div key={blog.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{blog.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{blog.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👁 {blog.views} lượt xem</span>
                    <span>❤️ {blog.likes} lượt thích</span>
                    {blog.publishDate && <span>📅 {blog.publishDate}</span>}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Xem
                  </button>
                  <button className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    <Edit className="h-3 w-3 mr-1" />
                    Sửa
                  </button>
                  {blog.status === 'draft' && (
                    <button className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      Xuất bản
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            window.location.href = '/blog';
          }}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          Xem trang Blog công khai
        </button>
      </div>
    </div>
  );

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển Tư vấn viên</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Chào mừng, Tư vấn viên</span>
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">T</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-sm font-bold hover:bg-green-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${activeTab === 'dashboard'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${activeTab === 'schedule'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Lịch làm việc
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${activeTab === 'blog'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'schedule' && <ScheduleManagement />}
        {activeTab === 'blog' && <BlogManagement />}
      </div>
    </div>
  );
};

export default ConsultantDashboard;
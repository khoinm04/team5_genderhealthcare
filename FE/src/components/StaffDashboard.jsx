import React, { useState, useEffect } from 'react';
import { useOnlineUsersSocket } from '../hooks/useOnlineUsersSocket';


import {
  Calendar, Clock, User, Plus, Edit3, Trash2, Eye, Search, Filter,
  CheckCircle, XCircle, Loader2, AlertCircle, Phone, Mail, FileText,
  Users, Activity, TestTube, Stethoscope, ChevronRight, Bell,
  BarChart3, TrendingUp, Settings, Save, X, FlaskConical
} from 'lucide-react';



const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { deactivateClient } = useOnlineUsersSocket(() => { });
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const [notes, setNotes] = useState('');
  const [consultPage, setConsultPage] = useState(0);
  const [consultSize, setConsultSize] = useState(10);
  const [consultTotalPages, setConsultTotalPages] = useState(0);

  const [testPage, setTestPage] = useState(0);
  const [testSize, setTestSize] = useState(10);
  const [testTotalPages, setTestTotalPages] = useState(0);

  const [testOrders, setTestOrders] = useState([]);
  const [schedules, setSchedules] = useState([])


  const [user, setUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditResultModal, setShowEditResultModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('schedule'); // 'schedule' or 'test'
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedResult, setSelectedResult] = useState("");





  const [newTestOrder, setNewTestOrder] = useState({
    customerName: '',
    email: '',
    phone: '',
    bookingDate: '',
    services: [],
    paymentCode: ''
  });

  const [newSchedule, setNewSchedule] = useState({
    customerName: '',
    email: '',
    phone: '',
    consultantName: '',
    consultantId: '',
    date: '',
    startTime: '',
    endTime: '',
    serviceId: '',
    age: '',             // 👈 thêm
    gender: ''
  });



  const [consultants, setConsultants] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [availableServices, setAvailableServices] = useState([])




  const getStatusColor = (status, type) => {
    console.log("🎯 getStatusColor() called → status:", status, "| type:", type);

    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';

    const normalized = status.toUpperCase();

    if (type === 'schedule') {
      switch (normalized) {
        case 'SCHEDULED':
        case 'PENDING_PAYMENT':
          return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'CONFIRMED':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'COMPLETED':
          return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'CANCELED':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }

    if (type === 'testOrder') {
      switch (normalized) {
        case 'PENDING':
          return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'IN_PROGRESS':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'COMPLETED':
          return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'CANCELED':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }

    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const translateSpecialization = (code) => {
    switch (code) {
      case "GENERAL_CONSULTATION":
        return "Tư vấn tổng quát";
      case "SPECIALIST_CONSULTATION":
        return "Tư vấn chuyên khoa";
      case "RE_EXAMINATION":
        return "Tư vấn tái khám";
      case "EMERGENCY_CONSULTATION":
        return "Tư vấn khẩn cấp";
      default:
        return "Không rõ";
    }
  };


  const getStatusIcon = (status, type) => {
    if (!status) return React.createElement(Clock, { className: "w-3 h-3" });

    const normalized = status.toUpperCase();

    const successStatuses = ['COMPLETED', 'CONFIRMED'];
    const canceledStatuses = ['CANCELED'];

    if (successStatuses.includes(normalized)) {
      return React.createElement(CheckCircle, { className: "w-3 h-3" });
    }

    if (canceledStatuses.includes(normalized)) {
      return React.createElement(XCircle, { className: "w-3 h-3" });
    }

    return React.createElement(Clock, { className: "w-3 h-3" });
  };


  // CRUD Functions for Schedules
  const handleCreateSchedule = async () => {
    const {
      customerName,
      email,
      phoneNumber,
      date,
      startTime,
      endTime,
      serviceId,
      consultantId,
      age,
      gender
    } = newSchedule;



    if (!customerName || !email || !phoneNumber || !date || !startTime || !endTime || !serviceId || !age || !gender) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const token = localStorage.getItem('token');
    const timeSlot = `${startTime}-${endTime}`;

    try {
      const res = await fetch('http://localhost:8080/api/staff/create/bookings/consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          customerEmail: email,
          customerPhone: phoneNumber,
          bookingDate: date,
          timeSlot,
          serviceId: parseInt(serviceId),
          consultantId: consultantId || null,
          status: 'PENDING_PAYMENT',
          age,
          gender
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text(); // 👈 lấy nội dung lỗi từ backend
        console.error("❌ API error response:", errorBody); // log chi tiết
        throw new Error('Tạo lịch hẹn thất bại');
      }

      const created = await res.json();

      setSchedules(prev => [...prev, created]);

      setNewSchedule({
        customerName: '',
        email: '',
        phoneNumber: '',
        consultantName: '',
        consultantId: '',
        serviceId: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: '60',
        age: '',
        gender: ''
      });
      setShowCreateModal(false);
      alert('✅ Lịch hẹn đã được tạo thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi tạo lịch hẹn:', err);
      alert('❌ Tạo lịch hẹn thất bại. Vui lòng thử lại.');
    }
  };




  //api này để chỉnh sửa lịch hẹn của consultant do thằng staff làm
  const handleEditSchedule = async () => {
    const {
      id,
      customerPhone,
      customerName,
      date,
      startTime,
      endTime,
      serviceId,
      consultantId,
    } = selectedItem;


    const timeSlot = `${startTime}-${endTime}`; // 👈 Gộp lại

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/staff/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          customerPhone,            // 👈 thêm dòng này nếu bạn có cho chỉnh
          bookingDate: date,   // 👈 sửa lại chỗ này
          timeSlot,
          serviceId,
          consultantId: consultantId || null,
          consultationStatus: selectedItem.consultationStatus, // 👈 thêm dòng này
        }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      setSchedules((prev) =>
        prev.map((item) => (item.id === id ? selectedItem : item))
      );
      setShowEditModal(false);
      setSelectedItem(null);
      alert("✅ Lịch hẹn đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật lịch:", error);
      alert("❌ Lỗi khi cập nhật lịch. Vui lòng thử lại.");
    }
  };



  const handleDeleteSchedule = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      setSchedules(prev => prev.filter(item => item.id !== id));
      alert('Lịch hẹn đã được xóa thành công!');
    }
  };

  // CRUD Functions for Test Orders
  const handleCreateTestOrder = async () => {
    const {
      customerName,
      email,
      phone: customerPhone,
      bookingDate,
      age: customerAge,
      gender: customerGender
    } = newTestOrder;

    if (customerName && email && bookingDate && selectedServiceId) {
      const payload = {
        customerName,
        customerEmail: email,
        customerPhone,
        customerAge,
        customerGender,
        bookingDate,
        timeSlot: `${newSchedule.startTime}-${newSchedule.endTime}`,
        serviceIds: [selectedServiceId], // ✅ wrap thành mảng
      };

      try {
        const res = await fetch("http://localhost:8080/api/staff/create/sti", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Lỗi khi tạo đơn");
        }

        const data = await res.json();
        alert(`Tạo đơn xét nghiệm thành công! ID: ${data.booking?.bookingId ?? "?"}`);

        // Reset form
        setNewTestOrder({
          customerName: '',
          email: '',
          phone: '',
          age: '',
          gender: '',
          bookingDate: '',
          services: [],
          paymentCode: ''
        });
        setNewSchedule({ startTime: '', endTime: '' });
        setSelectedServiceId(null); // ✅ reset lại dịch vụ được chọn
        setShowCreateModal(false);
      } catch (error) {
        console.error("Lỗi khi tạo đơn:", error);
        alert("Tạo đơn xét nghiệm thất bại: " + error.message);
      }
    } else {
      alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một dịch vụ!");
    }
  };




  const handleEditTestOrder = async () => {
    const token = localStorage.getItem("token");

    const payload = {
      bookingId: selectedItem.id,
      customerName: selectedItem.customerName,
      customerPhone: selectedItem.customerPhone,
      testResultUpdates: [] // ✅ chuyển từ Map sang List
    };

    selectedItem.testResults?.forEach(tr => {
      payload.testResultUpdates.push({
        testResultId: tr.testResultId,
        status: tr.status,
      });
    });

    console.log("📦 Payload gửi:", payload);

    try {
      const response = await fetch("http://localhost:8080/api/staff/bookings/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Lỗi response từ server:", errorText);
        throw new Error("Cập nhật thất bại");
      }

      const result = await response.json();
      console.log("✅ Cập nhật thành công:", result);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }
  };


  const handleDeleteTestOrder = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn xét nghiệm này?')) {
      setTestOrders(prev => prev.filter(item => item.id !== id));
      alert('Đơn xét nghiệm đã được xóa thành công!');
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/staff/services/consultation", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAvailableServices(data))
      .catch(err => console.error("❌ Không thể load dịch vụ tư vấn:", err));
  }, []);



  const updateStatus = async (id, newStatus, type) => {
    // 1. Cập nhật UI
    if (type === 'schedule') {
      setSchedules(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } else {
      setTestOrders(prev =>
        prev.map(item =>
          item.id === id ? { ...item, statusBooking: newStatus } : item
        )
      );

    }

    // 2. Lấy lại item
    const item = type === "schedule"
      ? schedules.find(s => s.id === id)
      : testOrders.find(t => t.id === id);

    if (!item) {
      alert("Không tìm thấy dữ liệu cần cập nhật.");
      return;
    }

    // 3. Gửi chỉ status
    const token = localStorage.getItem("token");
    const payload = {
      bookingId: item.id,
      status: newStatus
    };

    try {
      const response = await fetch("http://localhost:8080/api/staff/bookings/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("❌ Lỗi từ server:", err);
        throw new Error("Cập nhật thất bại");
      }

      const data = await response.json();
      console.log("✅ Đã cập nhật:", data);
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      alert("Lỗi khi cập nhật trạng thái xuống hệ thống.");
    }
  };



  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch =
      schedule.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.consultantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.service?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;

    return matchesSearch && matchesStatus;
  });



  const filteredTestOrders = testOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.statusCode === statusFilter;

    return matchesSearch && matchesStatus;
  });


  const todayAppointments = schedules.filter(s => s.date === '2025-01-15').length;
  const [activePatients, setActivePatients] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/staff/count-in-progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => setActivePatients(data))
      .catch(err => {
        console.error("Lỗi khi lấy số bệnh nhân:", err);
        setActivePatients(0); // fallback nếu lỗi
      });
  }, []);
  const pendingTests = testOrders.filter(t => t.status === 'Đang Chờ').length;



  // Hàm logout
  const handleLogout = async () => {
    await deactivateClient(); // 👈 Đảm bảo gửi tín hiệu offline và đóng kết nối
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  // để chưa userEffect để lấy thông tin user từ localStorage
  useEffect(() => {
    if (selectedItem?.serviceIds) {
      setSelectedServiceIds(selectedItem.serviceIds); // ✅ CHUẨN
    }
  }, [selectedItem]);

  useEffect(() => {
    console.log("🔍 selectedItem.serviceId:", selectedItem?.serviceId);
  }, [selectedItem?.serviceId]);


  //api để lấy danh sách consultant ứng với service Lưu ý cho chỉnh sửa
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!selectedItem || !selectedItem.serviceId) return;

    fetch(`http://localhost:8080/api/staff/consultants/by-service/${selectedItem.serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Không thể lấy danh sách tư vấn viên");
        return res.json();
      })
      .then(data => {
        console.log("✅ Consultants fetched:", data); // ← Thêm dòng này
        setConsultants(data);
      })
      .catch(err => console.error("❌ Lỗi lấy consultant:", err));
  }, [selectedItem?.serviceId]);


  //api để lấy danh sách consultant ứng với service Lưu ý cho tạo mới
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!newSchedule.serviceId) return; // ⛔ tránh gọi API khi chưa chọn dịch vụ

    fetch(`http://localhost:8080/api/staff/consultants/by-service/${newSchedule.serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Không thể lấy danh sách tư vấn viên");
        return res.json();
      })
      .then(data => {
        console.log("📥 Consultants loaded:", data);
        setConsultants(data);
      })
      .catch(err => console.error("Lỗi lấy consultant:", err));
  }, [newSchedule?.serviceId]); // 👈 gọi lại khi chọn dịch vụ khác




  const fetchTestOrders = (page = 0) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (storedUser) {
      setUser(storedUser);
    }
    if (!token) return;

    fetch(`http://localhost:8080/api/staff/bookings?page=${page}&size=${testSize}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Không thể lấy dữ liệu booking");
        return res.json();
      })
      .then(data => {
        const mapped = data.content.map(booking => {
          const rawStatus = booking.testResults?.[0]?.status ?? booking.status;
          const [startTime, endTime] = booking.timeSlot?.split('-') || [];

          return {
            id: booking.bookingId,
            customerId: `KH${booking.userId}`,
            customerName: booking.customerName,
            email: booking.customerEmail,
            customerPhone: booking.customerPhone,
            bookingDate: booking.bookingDate,
            statusBooking: booking.status?.toUpperCase() || "PENDING_PAYMENT",
            timeSlot: booking.timeSlot,
            startTime,
            endTime,
            status: rawStatus?.toUpperCase() || 'PENDING',
            statusCode: rawStatus?.toUpperCase() || 'PENDING',
            services: booking.testResults?.map(tr => tr.testName) ?? (booking.serviceName ? [booking.serviceName] : []),
            paymentCode: booking.paymentCode,
            staffId: booking.staffId,
            staffName: booking.staffName || storedUser?.name || "Ẩn danh",
            testResults: booking.testResults || [],
            consultantName: booking.consultantName || null
          };
        });

        setTestOrders(mapped);
        setTestTotalPages(data.totalPages);
      })
      .catch(err => {
        console.error("Lỗi khi tải booking xét nghiệm:", err);
        setTestOrders([]);
      });
  };

  useEffect(() => {
    fetchTestOrders(testPage);
  }, [testPage, testSize]);



  //lấy danh sách tư vấn viên
  const fetchConsultSchedules = (page = 0) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8080/api/staff/bookings/consulting?page=${page}&size=${consultSize}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Lỗi khi tải lịch tư vấn");
        return res.json();
      })
      .then(data => {
        const mapped = data.content.map(booking => {
          const [startTime, endTime] = booking.timeSlot?.split("-") || [];
          return {
            id: booking.bookingId,
            customerName: booking.customerName,
            customerPhone: booking.customerPhone,
            email: booking.customerEmail,
            consultantName: booking.consultantName || "Chưa gán",
            date: booking.date || booking.bookingDate,
            startTime,
            endTime,
            serviceName: booking.serviceName,
            duration: booking.duration || "",
            consultationStatus: booking.consultationStatus?.toUpperCase() || "PENDING",
            services: booking.serviceName ? [booking.serviceName] : [],
            serviceIds: booking.serviceIds || [],
            testResults: booking.testResults || [],
          };
        });

        setSchedules(mapped);
        setConsultTotalPages(data.totalPages);
      })
      .catch(err => {
        console.error("Không thể tải lịch tư vấn:", err);
        setSchedules([]);
      });
  };

  useEffect(() => {
    fetchConsultSchedules(consultPage);
  }, [consultPage, consultSize]);


  const translateStatusLabel = (consultationStatus, type) => {
    if (!consultationStatus) return "Không rõ";

    const normalizedStatus = consultationStatus.toUpperCase();

    if (type === "testOrder") {
      switch (normalizedStatus) {
        case "PENDING":
          return "Chờ xử lý";
        case "IN_PROGRESS":
          return "Đang thực hiện";
        case "COMPLETED":
          return "Đã hoàn thành";
        case "CANCELED":
          return "Đã hủy";
        default:
          return status;
      }
    }

    if (type === "schedule") {
      switch (normalizedStatus) {
        case "PENDING":
          return "Chờ xác nhận";
        case "CONFIRMED":
          return "Đã xác nhận";
        case "SCHEDULED":
          return "Đã lên lịch";
        case "ONGOING":
          return "Đang tư vấn";
        case "COMPLETED":
          return "Hoàn thành"
        case "CANCELED":
          return "Đã hủy"
        case "RESCHEDULED":
          return "Đã dời lịch"
        default:
          return status;
      }
    }

    return status;
  };

  const statusOptions = [
    { label: 'Chờ xác nhận', value: 'PENDING', color: 'yellow' },
    { label: 'Đã xác nhận', value: 'CONFIRMED', color: 'blue' },
    { label: 'Đã lên lịch', value: 'SCHEDULED', color: 'indigo' },
    { label: 'Đang tư vấn', value: 'ONGOING', color: 'sky' },
    { label: 'Đã hoàn thành', value: 'COMPLETED', color: 'emerald' },
    { label: 'Đã hủy', value: 'CANCELED', color: 'red' },
    { label: 'Đã dời lịch', value: 'RESCHEDULED', color: 'purple' },
  ];



  const colorMap = {
    yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300",
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    emerald: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200",
    red: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
  };

  console.log("✅ availableServices:", availableServices);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Bảng Điều Khiển Nhân Viên
                </h1>
                <p className="text-sm text-gray-500">Hệ Thống Quản Lý Y Tế</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">

              <div className="flex items-center space-x-3">
                <div className="text-right leading-tight">
                  <p className="h-2 text-sm font-medium text-gray-900">
                    NV. {user?.name ?? "Chưa có tên"}
                  </p>
                  <p className="text-xs text-gray-500">Nhân Viên Y Tế</p>
                </div>

                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">M</span>
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
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Tổng Quan', icon: BarChart3 },
              { id: 'schedules', label: 'Lịch Tư Vấn', icon: Calendar },
              { id: 'tests', label: 'Quản Lý Xét Nghiệm STI', icon: TestTube }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Cuộc Hẹn Hôm Nay</p>
                    <p className="text-3xl font-bold text-gray-900">{todayAppointments}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-2">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% so với hôm qua
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Bệnh Nhân Đang Điều Trị</p>
                    <p className="text-3xl font-bold text-gray-900">{activePatients}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-2">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8% tuần này
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Xét Nghiệm Chờ Xử Lý</p>
                    <p className="text-3xl font-bold text-gray-900">{pendingTests}</p>
                    <p className="text-xs text-amber-600 flex items-center mt-2">
                      <Activity className="w-3 h-3 mr-1" />
                      Cần xử lý
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Schedules */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Lịch Hẹn Gần Đây</h3>
                    <button
                      onClick={() => setActiveTab('schedules')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {schedules.slice(0, 3).map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{schedule.customerName}</p>
                          <p className="text-sm text-gray-500">{schedule.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{schedule.date}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.consultationStatus, 'schedule')}`}>
                          {getStatusIcon(schedule.consultationStatus, 'schedule')}
                          <span className="ml-1 capitalize">{translateStatusLabel(schedule.consultationStatus, 'schedule')}</span>
                        </span>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Test Orders */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Đơn Xét Nghiệm Gần Đây</h3>
                    <button
                      onClick={() => setActiveTab('tests')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {testOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <TestTube className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.services}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{order.bookingDate}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status, 'testOrder')}`}>
                          {getStatusIcon(order.status, 'testOrder')}
                          <span className="ml-1 capitalize">{translateStatusLabel(order.status, 'testOrder')}</span>
                        </span>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản Lý Lịch Tư Vấn</h2>
                <p className="text-gray-600">Quản lý cuộc hẹn và tư vấn</p>
              </div>
              <button
                onClick={() => {
                  setModalType('schedule');
                  setShowCreateModal(true);
                }}
                className="min-w-[130px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo Lịch Hẹn</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm khách hàng, tư vấn viên hoặc dịch vụ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedules Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tư Vấn Viên</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch Vụ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày & Giờ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-200">
                    {filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{schedule.customerName}</div>
                              <div className="text-sm text-gray-500">{schedule.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.consultantName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                              {schedule.serviceName}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{schedule.duration}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{schedule.date}</div>
                          <div className="text-sm text-gray-500">{schedule.startTime} - {schedule.endTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.consultationStatus, 'schedule')}`}>
                            {getStatusIcon(schedule.consultationStatus, 'schedule')}
                            <span className="ml-1 capitalize">{translateStatusLabel(schedule.consultationStatus, 'schedule')}</span>
                          </span>

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            {/* <button
                              onClick={() => {
                                setSelectedItem(schedule);
                                setModalType('result');
                                setShowEditResultModal(true); // bạn tạo một modal mới để nhập kết quả
                              }}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              title="Nhập kết quả"
                            >
                              <FlaskConical className="w-4 h-4" />
                            </button> */}
                            <button
                              onClick={() => {
                                setSelectedItem(schedule);
                                setModalType('schedule');
                                setShowDetailModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(schedule);
                                setModalType('schedule');
                                setShowEditModal(true);
                              }}
                              className="text-emerald-600 hover:text-emerald-900 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pb-4">
              <button
                onClick={() => setConsultPage((p) => Math.max(0, p - 1))}
                disabled={consultPage === 0}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                ◀ Trang trước
              </button>

              <span className="text-sm font-medium text-gray-700">
                Trang {consultPage + 1} / {consultTotalPages}
              </span>

              <button
                onClick={() => setConsultPage((p) => p + 1)}
                disabled={consultPage + 1 >= consultTotalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Trang sau ▶
              </button>

              <select
                value={testSize}
                onChange={(e) => {
                  setConsultSize(Number(e.target.value));
                  setConsultPage(0); // reset về trang đầu nếu đổi size
                }}
                className="ml-4 px-2 py-1 border rounded"
              >
                <option value={5}>5 dòng/trang</option>
                <option value={10}>10 dòng/trang</option>
                <option value={20}>20 dòng/trang</option>
              </select>
            </div>

          </div>
        )}

        {/* STI Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quản Lý Xét Nghiệm STI</h2>
                <p className="text-gray-600">Quản lý đơn xét nghiệm và thông tin bệnh nhân</p>
              </div>
              <button
                onClick={() => {
                  setModalType('test');
                  setShowCreateModal(true);
                }}
                className="min-w-[210px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm Đơn Xét Nghiệm</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên khách hàng, mã hoặc số điện thoại..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  >
                    <option value="all">Tất Cả Trạng Thái</option>
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="CANCELED">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Test Orders Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Xét Nghiệm</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch Vụ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái Thanh Toán</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-200">
                    {filteredTestOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                              {/* <div className="text-sm text-gray-500">{order.customerId}</div> */}
                              <div className="text-xs text-gray-400">{order.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{order.bookingDate}</span>
                            </div>
                            <div className="text-xs text-gray-500 pl-6">
                              {order.timeSlot || "Không có"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {order.services.map((serviceName, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                              >
                                {serviceName}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.statusCode, 'testOrder')}`}>
                            {getStatusIcon(order.statusCode, 'testOrder')}
                            <span className="ml-1 capitalize">{translateStatusLabel(order.statusCode, 'testOrder')}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.statusBooking, 'schedule')}`}>
                            {getStatusIcon(order.statusBooking, 'schedule')}
                            <span className="ml-1 capitalize">{translateStatusLabel(order.statusBooking, 'schedule')}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => {
                                const testResult = order.testResults?.[0]; // chỉ dùng cái đầu tiên
                                if (testResult) {
                                  setSelectedItem(testResult); // Lưu hẳn TestResult
                                  setSelectedResult(testResult.result || "");
                                  setModalType('result');
                                  setShowEditResultModal(true);
                                }
                              }}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              title="Nhập kết quả"
                            >
                              <FlaskConical className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(order);
                                setModalType('test');
                                setShowDetailModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(order);
                                setModalType('test');
                                setShowEditModal(true);
                              }}
                              className="text-emerald-600 hover:text-emerald-900 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTestOrder(order.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pb-4">
              <button
                onClick={() => setTestPage((p) => Math.max(0, p - 1))}
                disabled={testPage === 0}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                ◀ Trang trước
              </button>

              <span className="text-sm font-medium text-gray-700">
                Trang {testPage + 1} / {testTotalPages}
              </span>

              <button
                onClick={() => setTestPage((p) => p + 1)}
                disabled={testPage + 1 >= testTotalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Trang sau ▶
              </button>

              <select
                value={testSize}
                onChange={(e) => {
                  setTestSize(Number(e.target.value));
                  setTestPage(0); // reset về trang đầu nếu đổi size
                }}
                className="ml-4 px-2 py-1 border rounded"
              >
                <option value={5}>5 dòng/trang</option>
                <option value={10}>10 dòng/trang</option>
                <option value={20}>20 dòng/trang</option>
              </select>
            </div>

          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="min-w-[180px] bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="min-w-[180px] text-xl font-semibold text-gray-900 mb-6">
              {modalType === 'schedule' ? 'Tạo Lịch Hẹn Mới' : 'Thêm Đơn Xét Nghiệm Mới'}
            </h3>

            {modalType === 'schedule' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={newSchedule.customerName}
                      onChange={(e) => setNewSchedule({ ...newSchedule, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên khách hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newSchedule.email}
                      onChange={(e) => setNewSchedule({ ...newSchedule, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="khachhang@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={newSchedule.phoneNumber}
                      onChange={(e) => setNewSchedule({ ...newSchedule, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0123-456-789"
                    />
                  </div>
                  {/* --- Ô TUỔI --- */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tuổi *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={newSchedule.age || ''}              // bảo đảm undefined → ''
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, age: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tuổi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính *
                    </label>
                    <select
                      value={newSchedule.gender || ''}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, gender: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tư Vấn Viên</label>
                    <select
                      value={newSchedule.consultantId || ""}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value, 10);
                        const selectedConsultant = consultants.find(c => c.id === selectedId);
                        setNewSchedule(prev => ({
                          ...prev,
                          consultantId: selectedId,
                          consultantName: selectedConsultant?.fullName || "",
                        }));
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Tư Vấn Viên</option>
                      {consultants.map(consultant => (
                        <option key={consultant.id} value={consultant.id}>
                          {consultant.fullName} ({translateSpecialization(consultant.specialization)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dịch Vụ</label>
                    <select
                      value={newSchedule.serviceId || ""}
                      onChange={(e) => {
                        const selectedServiceId = parseInt(e.target.value, 10);
                        setNewSchedule(prev => ({
                          ...prev,
                          serviceId: selectedServiceId,
                          consultantId: "", // reset tư vấn viên nếu đổi dịch vụ
                          consultantName: "",
                        }));
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Dịch Vụ Tư Vấn</option>
                      {availableTests
                        .filter(service => service.categoryType === "CONSULTATION")
                        .map(service => (
                          <option key={service.serviceId} value={service.serviceId}>
                            {service.serviceName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày *</label>
                    <input
                      type="date"
                      value={newSchedule.date}
                      onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Bắt Đầu</label>
                    <input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Kết Thúc</label>
                    <input
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={newTestOrder.customerName}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập tên khách hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newTestOrder.email}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="khachhang@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={newTestOrder.phone}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0123-456-789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới Tính *</label>
                    <select
                      value={newTestOrder.gender}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tuổi *</label>
                    <input
                      type="number"
                      min="0"
                      value={newTestOrder.age}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, age: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="VD: 30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày Xét Nghiệm *</label>
                    <input
                      type="date"
                      value={newTestOrder.bookingDate}
                      onChange={(e) => setNewTestOrder({ ...newTestOrder, bookingDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Chọn Xét Nghiệm *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableTests
                      .filter(test => test.categoryType === "TEST")
                      .map((test) => (
                        <label
                          key={test.serviceId}
                          className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="testService"
                            value={test.serviceId}
                            checked={selectedServiceId === test.serviceId}
                            onChange={() => setSelectedServiceId(test.serviceId)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">{test.serviceName}</span>
                        </label>
                      ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Bắt Đầu</label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Kết Thúc</label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="min-w-[80px] px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={modalType === 'schedule' ? handleCreateSchedule : handleCreateTestOrder}
                className={`min-w-[160px] px-6 py-3 rounded-xl text-white transition-colors ${modalType === 'schedule'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
              >
                {modalType === 'schedule' ? 'Tạo Lịch Hẹn' : 'Thêm Đơn Xét Nghiệm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditResultModal && selectedItem && modalType === 'result' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Nhập Kết Quả Xét Nghiệm</h3>
              <button
                onClick={() => {
                  setShowEditResultModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>



            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Kết quả</label>
              <select
                value={selectedResult}
                onChange={(e) => setSelectedResult(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">-- Chọn kết quả --</option>
                <option value="Âm tính">Âm tính</option>
                <option value="Dương tính">Dương tính</option>
              </select>

              <label className="block text-sm font-medium text-gray-700">Ghi chú của bác sĩ</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú tại đây..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />


              <button
                onClick={handleSubmitResult}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg w-full"
              >
                Cập nhật kết quả
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {modalType === 'schedule' ? 'Chỉnh Sửa Lịch Hẹn' : 'Chỉnh Sửa Đơn Xét Nghiệm'}
            </h3>

            {modalType === 'schedule' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={selectedItem.customerName}
                      onChange={(e) => setSelectedItem({ ...selectedItem, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={selectedItem.customerPhone}
                      onChange={(e) => setSelectedItem({ ...selectedItem, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tư Vấn Viên</label>
                    <select
                      value={selectedItem.consultantId || ""}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value, 10);
                        setSelectedItem(prev => {
                          const selectedConsultant = consultants.find(c => c.id === selectedId);
                          return {
                            ...prev,
                            consultantId: selectedId,
                            consultantName: selectedConsultant?.fullName || "",
                          };
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Tư Vấn Viên</option>
                      {consultants.map(consultant => (
                        <option key={consultant.id} value={consultant.id}>
  {consultant.fullName} ({consultant.specialization})
</option>

                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dịch Vụ</label>
                    <select
                      value={selectedItem.serviceId || ""}
                      onChange={(e) => {
                        const selectedServiceId = parseInt(e.target.value, 10);
                        setSelectedItem({ ...selectedItem, serviceId: selectedServiceId });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn Dịch Vụ</option>
                      {availableServices.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày *</label>
                    <input
                      type="date"
                      value={selectedItem.date}
                      onChange={(e) =>
                        setSelectedItem({ ...selectedItem, date: e.target.value })
                      }
                      disabled={selectedItem.consultationStatus !== "RESCHEDULED"} // 👈 Chỉ cho chỉnh nếu là RESCHEDULED
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${selectedItem.consultationStatus !== "RESCHEDULED"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "border-gray-200"
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
                    <select
                      value={selectedItem.consultationStatus}
                      onChange={(e) => setSelectedItem({ ...selectedItem, consultationStatus: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="SCHEDULED">Đã lên lịch</option>
                      <option value="ONGOING">Đang tư vấn</option>
                      <option value="RESCHEDULED">Đã dời lịch</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELED">Đã hủy</option>
                    </select>
                  </div>

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Bắt Đầu</label>
                    <input
                      type="time"
                      value={selectedItem.startTime}
                      onChange={(e) =>
                        setSelectedItem({ ...selectedItem, startTime: e.target.value })
                      }
                      disabled={selectedItem.consultationStatus !== "RESCHEDULED"} // 👈 Chỉ cho chỉnh nếu là RESCHEDULED
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${selectedItem.consultationStatus !== "RESCHEDULED"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "border-gray-200"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ Kết Thúc</label>
                    <input
                      type="time"
                      value={selectedItem.endTime}
                      onChange={(e) =>
                        setSelectedItem({ ...selectedItem, endTime: e.target.value })
                      }
                      disabled={selectedItem.consultationStatus !== "RESCHEDULED"} // 👈 Như trên
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${selectedItem.consultationStatus !== "RESCHEDULED"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "border-gray-200"
                        }`}
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên Khách Hàng *</label>
                    <input
                      type="text"
                      value={selectedItem.customerName}
                      onChange={(e) => setSelectedItem({ ...selectedItem, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={selectedItem.email}
                      disabled
                      onChange={(e) => setSelectedItem({ ...selectedItem, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={selectedItem.customerPhone}
                      onChange={(e) => setSelectedItem({ ...selectedItem, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày Xét Nghiệm *</label>
                    <input
                      type="date"
                      value={selectedItem.bookingDate}
                      disabled
                      onChange={(e) => setSelectedItem({ ...selectedItem, bookingDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
                    <select
                      value={selectedItem.testResults?.[0]?.status || ""}
                      onChange={(e) => {
                        const updatedTestResults = [...(selectedItem.testResults || [])];
                        if (updatedTestResults[0]) {
                          updatedTestResults[0] = {
                            ...updatedTestResults[0],
                            status: e.target.value
                          };
                        }
                        setSelectedItem((prev) => ({
                          ...prev,
                          testResults: updatedTestResults
                        }));
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="IN_PROGRESS">Đang xử lý</option>
                      <option value="COMPLETED">Đã hoàn thành</option>
                      <option value="CANCELED">Đã hủy</option>
                    </select>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã Thanh Toán</label>
                    <input
                      type="text"
                      value={selectedItem.paymentCode}
                      onChange={(e) => setSelectedItem({ ...selectedItem, paymentCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div> */}
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Chọn Xét Nghiệm</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableTests.map((test) => (
                      <label key={test.serviceId} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(test.serviceId)} // ✅ dùng serviceId
                          onChange={() => handleServiceToggle(test.serviceId)}  // ✅ toggle theo serviceId
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{test.serviceName}</span>
                      </label>
                    ))}
                  </div>
                </div> */}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={modalType === 'schedule' ? handleEditSchedule : handleEditTestOrder}
                className={`px-6 py-3 rounded-xl text-white transition-colors flex items-center space-x-2 ${modalType === 'schedule'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalType === 'schedule' ? 'Chi Tiết Lịch Hẹn' : 'Chi Tiết Đơn Xét Nghiệm'}
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Khách Hàng</p>
                  <p className="text-sm text-gray-900">{selectedItem.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-gray-900">{selectedItem.email}</p>
                </div>
                {selectedItem.customerPhone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Số Điện Thoại</p>
                    <p className="text-sm text-gray-900">{selectedItem.customerPhone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Ngày</p>
                  <p className="text-sm text-gray-900">{selectedItem.date || selectedItem.bookingDate}</p>
                </div>
                {selectedItem.consultantName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Tư Vấn Viên</p>
                    <p className="text-sm text-gray-900">{selectedItem.consultantName}</p>
                  </div>
                )}
                {/* {selectedItem.serviceName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Dịch Vụ</p>
                    <p className="text-sm text-gray-900">{selectedItem.serviceName}</p>
                  </div>
                )} */}
                {/* {selectedItem.customerId && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Mã Khách Hàng</p>
                    <p className="text-sm text-gray-900">{selectedItem.customerId}</p>
                  </div>
                )} */}
                {selectedItem.paymentCode && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Mã Thanh Toán</p>
                    <p className="text-sm text-gray-900">{selectedItem.paymentCode}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Trạng Thái</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedItem.status, modalType === 'test' ? 'testOrder' : 'schedule')}`}>
                    {getStatusIcon(selectedItem.status, modalType)}
                    <span className="ml-1"><span className="ml-1">{translateStatusLabel(selectedItem.status, modalType === 'test' ? 'testOrder' : 'schedule')}</span>
                    </span>
                  </span>


                </div>
              </div>

              {selectedItem.services && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Dịch Vụ/Xét Nghiệm</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.startTime && selectedItem.endTime && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Thời Gian</p>
                  <p className="text-sm text-gray-900">{selectedItem.startTime} - {selectedItem.endTime}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-3">Cập Nhật Trạng Thái</p>
                {/* <div className="flex flex-wrap gap-2">
                  {modalType === 'schedule' ? (
                    <>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'PENDING_PAYMENT', 'schedule')}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors border border-yellow-300"
                      >
                        Chờ thanh toán
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'CONFIRMED', 'schedule')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors border border-blue-200"
                      >
                        Đã xác nhận
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'COMPLETE', 'schedule')}
                        className="px-3 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200 transition-colors border border-emerald-200"
                      >
                        Đã hoàn thành
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'CANCELED', 'schedule')}
                        className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors border border-red-200"
                      >
                        Đã hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'PENDING', 'testOrder')}
                        className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors border border-amber-200"
                      >
                        Đang Chờ
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'IN_PROGRESS', 'testOrder')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors border border-blue-200"
                      >
                        Đang Thực Hiện
                      </button>
                      <button
                        onClick={() => updateStatus(selectedItem.id, 'COMPLETED', 'testOrder')}
                        className="px-3 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200 transition-colors border border-emerald-200"
                      >
                        Đã Hoàn Thành
                      </button>
                    </>
                  )}
                </div> */}
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateStatus(selectedItem.id, opt.value, modalType)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors border ${colorMap[opt.color]}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
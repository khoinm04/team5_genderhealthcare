import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle,
    QrCode,
    Copy,
    Check,
    Home
} from 'lucide-react';
import PaymentPage from '../PaymentPage';

const ConsultationBooking = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const navigate = useNavigate(); // ✅ đặt ở đầu component
    const [contactInfo, setContactInfo] = useState({
        fullName: '',
        phone: '',
        email: '',
        age: '',
        gender: '',
        notes: ''
    });
    const [appointments, setAppointments] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [latestBooking, setLatestBooking] = useState(null);
    const [paymentCode, setPaymentCode] = useState('');
    const [copiedCode, setCopiedCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Memoize services to prevent re-creation on every render
    const services = useMemo(() => [
        {
            serviceId: 1,
            serviceName: 'Tư vấn tổng quát',
            category: 'GENERAL_CONSULTATION',
            price: 300000,
            description: 'Khám sức khỏe định kỳ và tư vấn'
        },
        {
            serviceId: 2,
            serviceName: 'Tư vấn chuyên khoa',
            category: 'SPECIALIST_CONSULTATION',
            price: 200000,
            description: 'Tư vấn với bác sĩ chuyên khoa'
        },
        {
            serviceId: 3,
            serviceName: 'Tái khám',
            category: 'RE_EXAMINATION',
            price: 150000,
            description: 'Tư vấn tái khám'
        },
        {
            serviceId: 4,
            serviceName: 'Tư vấn khẩn cấp',
            category: 'EMERGENCY_CONSULTATION',
            price: 300000,
            description: 'Tư vấn y tế khẩn cấp'
        }
    ], []);

    // Memoize time slots to prevent re-creation
    const timeSlots = useMemo(() => [
        '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00',
        '10:00-10:30', '10:30-11:00', '14:00-14:30', '14:30-15:00',
        '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00',
    ], []);

    // Placeholder for handleHomeExit function
    const handleHomeExit = useCallback(() => {
        // if (window.confirm('Bạn có chắc chắn muốn thoát khỏi hệ thống?')) {
        window.location.href = '/';
        // }
    }, []);

    const getMinDate = useCallback(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }, []);

    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }, []);

    // Memoized handlers to prevent re-creation
    const handleServiceSelect = useCallback((service) => {
        setSelectedService(service);
        setError('');
    }, []);

    const handleDateChange = useCallback((e) => {
        setSelectedDate(e.target.value);
        setError('');
    }, []);

    const handleTimeSelect = useCallback((time) => {
        setSelectedTime(time);
        setError('');
    }, []);

    // CRITICAL: Stable input change handler
    const handleContactInfoChange = useCallback((field, value) => {
        setContactInfo(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    }, []);

    // Enhanced validation function
    const validateBookingForm = useCallback(() => {
        const errors = [];

        // Service validation
        if (!selectedService) {
            errors.push('Vui lòng chọn dịch vụ tư vấn');
        }

        // Date validation
        if (!selectedDate) {
            errors.push('Vui lòng chọn ngày tư vấn');
        }

        // Time validation
        if (!selectedTime) {
            errors.push('Vui lòng chọn giờ tư vấn');
        }

        // Personal information validation
        if (!contactInfo.fullName || contactInfo.fullName.trim() === '') {
            errors.push('Vui lòng nhập họ và tên');
        }

        if (contactInfo.age === undefined || contactInfo.age === null || contactInfo.age === '') {
            errors.push('Vui lòng nhập tuổi');
        } else {
            const age = parseInt(contactInfo.age);
            if (isNaN(age) || age < 0 || age > 150) {
                errors.push('Tuổi không hợp lệ (0-150)');
            }
        }


        if (!contactInfo.gender || contactInfo.gender === '') {
            errors.push('Vui lòng chọn giới tính');
        }

        if (!contactInfo.phone || contactInfo.phone.trim() === '') {
            errors.push('Vui lòng nhập số điện thoại');
        } else {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(contactInfo.phone.replace(/\s/g, ''))) {
                errors.push('Số điện thoại không hợp lệ (10-11 chữ số)');
            }
        }

        if (!contactInfo.email || contactInfo.email.trim() === '') {
            errors.push('Vui lòng nhập địa chỉ email');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactInfo.email)) {
                errors.push('Địa chỉ email không hợp lệ');
            }
        }

        return errors;
    }, [selectedService, selectedDate, selectedTime, contactInfo]);

    const canProceedToNextStep = useMemo(() => {
        const errors = validateBookingForm();
        return errors.length === 0;
    }, [validateBookingForm]);

    const handleNext = useCallback(() => {
        if (canProceedToNextStep && currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    }, [canProceedToNextStep, currentStep]);

    const handleBack = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    const copyPaymentCode = useCallback(async () => {
        if (paymentCode) {
            try {
                await navigator.clipboard.writeText(paymentCode);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
            } catch (err) {
                const textArea = document.createElement('textarea');
                textArea.value = paymentCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
            }
        }
    }, [paymentCode]);

    const generatePaymentCode = useCallback(() => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `PAY${timestamp}${random}`;
    }, []);

    const handlePaymentConfirmation = useCallback(async () => {
        try {
            setLoading(true);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            alert("Xác nhận thanh toán thành công!");
            setCurrentStep(6);
        } catch (error) {
            console.error("Lỗi xác nhận thanh toán:", error);
            alert("Đã xảy ra lỗi khi xác nhận thanh toán.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Cancel payment handler
    const handleCancelPayment = useCallback(() => {
        if (window.confirm('Bạn có chắc chắn muốn hủy thanh toán? Thông tin đặt lịch sẽ bị mất.')) {
            // Reset to booking form
            setCurrentStep(1);
            setPaymentCode('');
            setLatestBooking(null);
            setError('');
        }
    }, []);

    // Handle payment confirmation
    const handleConfirmBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.");
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
            return;
        }

        const userEmail = decoded.sub;
        if (!userEmail) {
            setError("Không tìm thấy thông tin người dùng trong token. Vui lòng đăng nhập lại.");
            return;
        }

        if (!canProceedToNextStep) return;

        setLoading(true);
        setError('');
        try {
            // 📌 1. Gửi yêu cầu đặt lịch
            const bookingData = {
                userEmail: userEmail,
                serviceIds: [selectedService.serviceId],
                bookingDate: selectedDate,
                timeSlot: selectedTime,
                customerName: contactInfo.fullName,
                customerAge: parseInt(contactInfo.age),
                customerGender: contactInfo.gender,
                customerPhone: contactInfo.phone,
                customerEmail: contactInfo.email
            };

            const bookingResponse = await axios.post(
                'http://localhost:8080/api/bookings',
                bookingData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );

            const responseData = bookingResponse.data;

            // 📌 2. Lưu lại appointment nếu cần
            const newAppointment = {
                id: responseData.booking.bookingId,
                service: selectedService,
                date: responseData.booking.bookingDate,
                time: responseData.booking.timeSlot,
                contact: {
                    ...contactInfo,
                    notes: contactInfo.notes
                },
                status: responseData.booking.status,
                createdAt: new Date().toLocaleString('vi-VN'),
                paymentCode: responseData.paymentCode,
                customerName: responseData.booking.customerName || contactInfo.fullName
            };

            setAppointments(prev => [...prev, newAppointment]);
            setLatestBooking(newAppointment);
            setPaymentCode(responseData.paymentCode);

            // 📌 3. Gọi API tạo thanh toán VNPAY
            console.log("Gửi sang backend:", {
  bookingId: responseData.booking.bookingId,
  amount: selectedService.price
});

            const paymentRes = await axios.post(
                'http://localhost:8080/api/payment/create',
                {
                    bookingId: responseData.booking.bookingId,
                    amount: selectedService.price

                },
                {
                    headers: {
                        'Content-Type': 'application/json',        // 🔧 BỔ SUNG DÒNG NÀY
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log({
                bookingId: responseData.booking.bookingId,
                amount: selectedService.price
            });


            // 📌 Redirect tới VNPAY
           // ✅ Thay vì redirect, dùng navigate
        window.location.href = paymentRes.data.paymentUrl;




        } catch (error) {
            console.error('Lỗi khi đặt lịch hoặc thanh toán:', error);
            if (error.response) {
                console.error('Chi tiết:', error.response.data);
                setError(error.response.data.error || error.response.data.message || 'Có lỗi xảy ra từ server.');
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // api lay thong tin ngươi dung co san
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("user"))?.token;

                const res = await axios.get("/api/bookings/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Dữ liệu user:", res.data); // ✅ debug tại đây


                if (res.data && (res.data.fullName || res.data.phone)) {
                    // Có dữ liệu → điền vào form
                    setContactInfo({
                        fullName: res.data.fullName || "",
                        age: res.data.age || "",
                        gender: res.data.gender || "",
                        phone: res.data.phone || "",
                        email: res.data.email || ""
                    });
                }
            } catch (err) {
                console.error("Lỗi lấy thông tin user:", err);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            await axios.put("/api/bookings/profile", contactInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Cập nhật thông tin thành công");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi cập nhật thông tin");
        }
    };


    // Memoized input components to prevent re-rendering
    const PersonalInfoInputs = useMemo(() => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div className="h-20">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên *
                        </label>
                        <input
                            type="text"
                            value={contactInfo.fullName}
                            onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
                            className={`w-full h-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!contactInfo.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Nhập họ và tên"
                            autoComplete="name"
                            required
                        />
                        {!contactInfo.fullName && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng điền đầy đủ thông tin</p>
                        )}
                    </div>

                    <div className="h-20">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tuổi *
                        </label>
                        <input
                            type="number"
                            value={contactInfo.age}
                            onChange={(e) => handleContactInfoChange('age', e.target.value)}
                            className={`w-full h-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!contactInfo.age ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Nhập tuổi"
                            min="0"
                            max="150"
                            autoComplete="off"
                            required
                        />
                        {!contactInfo.age && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng điền đầy đủ thông tin</p>
                        )}
                    </div>

                    <div className="h-20">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính *
                        </label>
                        <select
                            value={contactInfo.gender}
                            onChange={(e) => handleContactInfoChange('gender', e.target.value)}
                            className={`w-full h-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!contactInfo.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            required
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                        {!contactInfo.gender && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng điền đầy đủ thông tin</p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div className="h-20">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại *
                        </label>
                        <input
                            type="tel"
                            value={contactInfo.phone}
                            onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                            className={`w-full h-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!contactInfo.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Nhập số điện thoại"
                            autoComplete="tel"
                            required
                        />
                        {!contactInfo.phone && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng điền đầy đủ thông tin</p>
                        )}
                    </div>

                    <div className="h-20">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => handleContactInfoChange('email', e.target.value)}
                            className={`w-full h-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!contactInfo.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Nhập địa chỉ email"
                            autoComplete="email"
                            required
                        />
                        {!contactInfo.email && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng điền đầy đủ thông tin</p>
                        )}
                    </div>

                    <div className="h-20">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày tư vấn *
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className={`w-full h-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${!selectedDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            min={getMinDate()}
                            required
                        />
                        {!selectedDate && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng điền đầy đủ thông tin</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }, [contactInfo, selectedDate, handleContactInfoChange, handleDateChange, getMinDate]);

    const ConsultationBooking = useMemo(() => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Service Selection and Form - Fixed width container */}
                <div className="lg:col-span-2">
                    {/* Service Selection */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Chọn dịch vụ tư vấn *
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <div
                                    key={service.serviceId}
                                    onClick={() => handleServiceSelect(service)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedService?.serviceId === service.serviceId
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-300"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{service.serviceName}</h3>
                                        <span className="text-blue-600 font-bold">
                                            {service.price.toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>⏱ 30 phút</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded">
                                            {service.category.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!selectedService && (
                            <p className="text-red-500 text-sm mt-2">Vui lòng chọn một dịch vụ</p>
                        )}
                    </div>

                    {/* Booking Form - Fixed height and stable layout */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Thông tin đặt lịch
                        </h2>

                        {/* Fixed container to prevent layout shifts */}
                        <div className="w-full" style={{ minHeight: '600px' }}>
                            {/* Personal Information Grid - Fixed layout */}
                            {PersonalInfoInputs}
                            {/* Nút lưu thông tin */}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleUpdateProfile}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Lưu thông tin
                                </button>
                            </div>

                            {/* Time Selection - Fixed height */}
                            <div className="mb-6" style={{ minHeight: '120px' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Giờ tư vấn *
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelect(time)}
                                            className={`h-10 text-sm border rounded-lg transition-colors ${selectedTime === time
                                                ? "border-blue-600 bg-blue-50 text-blue-600"
                                                : "border-gray-300 hover:border-blue-300"
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                                {!selectedTime && (
                                    <p className="text-red-500 text-sm mt-2">Vui lòng chọn giờ tư vấn</p>
                                )}
                            </div>

                            {/* Notes - Fixed height */}
                            <div style={{ minHeight: '120px' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú (không bắt buộc)
                                </label>
                                <textarea
                                    value={contactInfo.notes}
                                    onChange={(e) => handleContactInfoChange('notes', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                    placeholder="Thông tin bổ sung..."
                                    style={{ height: '80px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Summary - Stable positioning */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24" style={{ height: 'fit-content' }}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Tóm tắt đặt lịch
                        </h3>

                        {/* Summary content with fixed minimum height */}
                        <div style={{ minHeight: '200px' }}>
                            {selectedService ? (
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{selectedService.serviceName}</p>
                                            <p className="text-sm text-gray-500">30 phút</p>
                                        </div>
                                        <span className="font-medium text-blue-600">
                                            {selectedService.price.toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 mb-6">Chưa chọn dịch vụ nào</p>
                            )}

                            {selectedService && (
                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            Tổng cộng:
                                        </span>
                                        <span className="text-xl font-bold text-blue-600">
                                            {selectedService.price.toLocaleString("vi-VN")} đ
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleConfirmBooking}
                            disabled={!canProceedToNextStep || loading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${canProceedToNextStep && !loading
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt lịch tư vấn'}
                        </button>

                        {/* Validation Summary */}
                        {!canProceedToNextStep && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <h4 className="font-semibold text-red-800 mb-2 text-sm">
                                    Vui lòng hoàn thành:
                                </h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    {!selectedService && <li>• Chọn dịch vụ tư vấn</li>}
                                    {!selectedDate && <li>• Chọn ngày tư vấn</li>}
                                    {!selectedTime && <li>• Chọn giờ tư vấn</li>}
                                    {!contactInfo.fullName && <li>• Nhập họ và tên</li>}
                                    {!contactInfo.age && <li>• Nhập tuổi</li>}
                                    {!contactInfo.gender && <li>• Chọn giới tính</li>}
                                    {!contactInfo.phone && <li>• Nhập số điện thoại</li>}
                                    {!contactInfo.email && <li>• Nhập địa chỉ email</li>}
                                </ul>
                            </div>
                        )}

                        {/* Important Notes */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 mb-2">
                                Lưu ý quan trọng:
                            </h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Mang theo CMND/CCCD khi đến tư vấn</li>
                                <li>• Đến đúng giờ hẹn để đảm bảo chất lượng dịch vụ</li>
                                <li>• Thông tin được bảo mật tuyệt đối</li>
                                <li>• Có thể hủy lịch trước 24h</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [services, selectedService, handleServiceSelect, PersonalInfoInputs, timeSlots, selectedTime, handleTimeSelect, contactInfo.notes, handleContactInfoChange, canProceedToNextStep, loading, handleConfirmBooking]);

    const PaymentSection = useMemo(() => {
        return (
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                    <QrCode className="w-6 h-6 mr-2" />
                    Thanh toán QR Code
                </h2>

                <div className="text-center">
                    <div className="bg-gray-100 p-8 rounded-lg mb-6 inline-block">
                        <QrCode className="h-32 w-32 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">QR Code thanh toán</p>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700 mb-2">Mã thanh toán:</p>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-pink-600 font-mono text-lg">{paymentCode}</span>
                            <button
                                onClick={copyPaymentCode}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="border-t pt-4 mb-6">
                        <p className="text-lg">
                            Số tiền: <span className="text-blue-600 font-bold">{formatPrice(selectedService?.price)}</span>
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                        <h3 className="font-semibold text-gray-900 mb-3">Hướng dẫn thanh toán:</h3>
                        <ol className="text-sm text-gray-700 space-y-1">
                            <li>1. Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                            <li>2. Chọn chức năng quét QR Code</li>
                            <li>3. Quét mã QR hoặc nhập mã thanh toán</li>
                            <li>4. Xác nhận số tiền và thực hiện thanh toán</li>
                            <li>5. Sau khi thanh toán, nhấn "Xác nhận đã thanh toán"</li>
                        </ol>
                    </div>

                    {/* Payment Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <button
                            onClick={handlePaymentConfirmation}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {loading ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
                        </button>

                        <button
                            onClick={handleCancelPayment}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            Hủy thanh toán
                        </button>
                    </div>

                    <p className="text-xs text-gray-500">
                        * Vui lòng chỉ nhấn xác nhận sau khi đã hoàn tất thanh toán
                    </p>
                </div>

                {/* Appointment Details Section */}
                <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Lịch hẹn của bạn</h3>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">{selectedService?.serviceName}</h4>
                                <p className="text-sm text-gray-600">Mã thanh toán: {paymentCode}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-blue-600">{formatPrice(selectedService?.price)}</span>
                                <p className="text-sm text-gray-600">{formatDate(selectedDate)} | {selectedTime}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <p className="text-sm">
                                <span className="font-medium text-gray-700">Trạng thái:</span>
                                <span className="text-orange-600 font-medium"> PENDING_PAYMENT</span>
                            </p>
                            <p className="text-sm">
                                <span className="font-medium text-gray-700">Họ tên:</span> {contactInfo.fullName}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium text-gray-700">Tuổi:</span> {contactInfo.age}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium text-gray-700">Giới tính:</span> {
                                    contactInfo.gender === 'MALE' ? 'Nam' :
                                        contactInfo.gender === 'FEMALE' ? 'Nữ' : 'Khác'
                                }
                            </p>
                            <p className="text-sm">
                                <span className="font-medium text-gray-700">Số điện thoại:</span> {contactInfo.phone}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium text-gray-700">Email:</span> {contactInfo.email}
                            </p>
                            {contactInfo.notes && (
                                <p className="text-sm">
                                    <span className="font-medium text-gray-700">Ghi chú:</span> {contactInfo.notes}
                                </p>
                            )}
                            <p className="text-sm">
                                <span className="font-medium text-gray-700">Ngày tạo:</span> {new Date().toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [paymentCode, copiedCode, copyPaymentCode, formatPrice, selectedService, formatDate, selectedDate, selectedTime, contactInfo, loading, handlePaymentConfirmation, handleCancelPayment]);

    const SuccessSection = useMemo(() => {
        return (
            <div className="text-center max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h2>
                    <p className="text-lg text-gray-600">
                        Cảm ơn bạn đã đặt lịch tư vấn. Chúng tôi sẽ liên hệ với bạn sớm nhất.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Thông tin lịch hẹn</h3>
                    <div className="space-y-2 text-left">
                        <p className="text-green-700">
                            <span className="font-medium">Dịch vụ:</span> {selectedService?.serviceName}
                        </p>
                        <p className="text-green-700">
                            <span className="font-medium">Ngày:</span> {formatDate(selectedDate)}
                        </p>
                        <p className="text-green-700">
                            <span className="font-medium">Giờ:</span> {selectedTime}
                        </p>
                        <p className="text-green-700">
                            <span className="font-medium">Họ tên:</span> {contactInfo.fullName}
                        </p>
                        <p className="text-green-700">
                            <span className="font-medium">Số tiền:</span> {formatPrice(selectedService?.price)}
                        </p>
                        <p className="text-green-700">
                            <span className="font-medium">Trạng thái:</span> <span className="text-green-600 font-semibold">ĐÃ THANH TOÁN</span>
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-600">
                        Một email xác nhận đã được gửi đến <strong>{contactInfo.email}</strong>
                    </p>
                    <p className="text-gray-600">
                        Chúng tôi sẽ gọi điện xác nhận lịch hẹn qua số <strong>{contactInfo.phone}</strong>
                    </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Về trang chủ
                    </button>
                    <button
                        onClick={() => window.location.href = '/booking'}
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Đặt lịch khác
                    </button>
                </div>
            </div>
        );
    }, [selectedService, formatDate, selectedDate, selectedTime, contactInfo, formatPrice]);

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            {/* Home Button - fixed at top-left, blue, beautiful */}
            <button
                className="fixed top-6 left-6 z-50 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-16 py-3 rounded-full font-bold text-[24px] shadow-xl"
                style={{
                    minWidth: 0,
                    boxShadow: "0 6px 32px 0 rgba(59, 130, 246, 0.18)",
                }}
                onClick={handleHomeExit}
            >
                <ChevronLeft className="w-8 h-8 mr-3 text-white" />
                Trang chủ
            </button>

            {/* Header */}
            <div className="bg-blue-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <Calendar className="h-8 w-8" />
                            <h1 className="text-3xl font-bold">Đặt lịch tư vấn trực tuyến</h1>
                        </div>
                    </div>
                    <p className="text-blue-100 text-lg">
                        Chọn dịch vụ và thời gian phù hợp với bạn
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {currentStep < 5 && ConsultationBooking}
                {currentStep === 5 && (
                    <PaymentPage
                        paymentCode={paymentCode}
                        amount={selectedService?.price}
                        testName={selectedService?.serviceName}
                        bookingId={latestBooking?.id}
                        onCancel={() => {
                            setCurrentStep(1);
                            setPaymentCode('');
                            setLatestBooking(null);
                            setError('');
                        }}
                        onSuccess={() => setCurrentStep(6)}
                    />
                )}
                {currentStep === 6 && SuccessSection}
            </div>
        </div>
    );
};

export default ConsultationBooking;
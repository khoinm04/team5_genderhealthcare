import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, ChevronLeft, ChevronRight, X, CheckCircle, QrCode, Copy, Check } from 'lucide-react';

const ConsultationBooking = ({ onClose }) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [appointments, setAppointments] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);
  const [paymentCode, setPaymentCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Updated services to match backend enum
  const services = [
    {
      id: 1,
      name: 'Tư vấn tổng quát',
      duration: '30 phút',
      price: '200,000đ',
      category: 'GENERAL_CONSULTATION'
    },
    {
      id: 2,
      name: 'Tư vấn chuyên khoa',
      duration: '45 phút',
      price: '350,000đ',
      category: 'SPECIALIST_CONSULTATION'
    },
    {
      id: 3,
      name: 'Tái khám',
      duration: '20 phút',
      price: '150,000đ',
      category: 'RE_EXAMINATION'
    },
    {
      id: 4,
      name: 'Tư vấn khẩn cấp',
      duration: '60 phút',
      price: '500,000đ',
      category: 'EMERGENCY_CONSULTATION'
    }
  ];

  // Updated time slots to match backend format (HH:mm-HH:mm)
  const timeSlots = [
    '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00',
    '10:00-10:30', '10:30-11:00', '14:00-14:30', '14:30-15:00',
    '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00',
    '19:00-19:30', '19:30-20:00', '20:00-20:30', '20:30-21:00'
  ];

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateForBackend = (dateString) => {
    // Backend expects YYYY-MM-DD for bookingDate
    // The input type="date" already gives this format, so just return it.
    return dateString;
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContactInfoChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== '';
      case 3:
        return selectedTime !== '';
      case 4:
        return contactInfo.fullName && contactInfo.phone && contactInfo.email;
      case 5:
        return true; // Payment step - always can proceed (after booking is created)
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const copyPaymentCode = async () => {
    if (paymentCode) {
      try {
        await navigator.clipboard.writeText(paymentCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (err) {
        // Fallback for older browsers (less reliable)
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
  };

  const handleConfirmBooking = async () => {
    if (canProceedToNextStep()) {
      const bookingData = {
        userId: 1, // <<< IMPORTANT: This should come from an actual authenticated user. Hardcoded for demonstration.
        serviceIds: [selectedService.id], // Backend expects an array of service IDs
        bookingDate: formatDateForBackend(selectedDate), // YYYY-MM-DD
        timeSlot: selectedTime, // HH:mm-HH:mm
        customerName: contactInfo.fullName,
        customerPhone: contactInfo.phone,
        customerEmail: contactInfo.email,
        notes: contactInfo.notes // Optional, based on backend DTO
      };

      try {
        const response = await fetch('http://localhost:8080/api/bookings', { // <<< API Endpoint for your backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // If your backend requires authentication (e.g., JWT), you would add:
            // 'Authorization': `Bearer YOUR_AUTH_TOKEN`
          },
          body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
          // Attempt to parse error message from backend
          let errorMessage = 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (jsonError) {
            // If response is not JSON, use generic message
            console.error('Error parsing backend error response:', jsonError);
          }
          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        // responseData should contain 'booking' and 'paymentCode' from your backend
        // e.g., { booking: { ... }, paymentCode: "PAY-20231026-1234" }

        const newAppointment = {
          id: responseData.booking.bookingId, // Use ID from backend response
          service: selectedService, // Retain selected service details from frontend for display
          date: responseData.booking.bookingDate, // Use date from backend (should be same as selectedDate)
          time: responseData.booking.timeSlot, // Use time from backend (should be same as selectedTime)
          contact: contactInfo,
          status: responseData.booking.status, // Get status from backend, e.g., 'PENDING_PAYMENT'
          createdAt: new Date().toLocaleString('vi-VN'), // Could also get from backend if provided
          paymentCode: responseData.paymentCode // Get payment code from backend
        };
        
        setAppointments(prev => [...prev, newAppointment]);
        setLatestBooking(newAppointment);
        setPaymentCode(newAppointment.paymentCode); // Set payment code for display
        setCurrentStep(5); // Move to payment step

      } catch (error) {
        console.error('Error creating booking:', error);
        alert(error.message); // Show the specific error message from backend or a generic one
      }
    }
  };

  const handlePaymentConfirmation = () => {
    // In a real application, this would trigger an API call to confirm payment status
    // For now, we just mark it as successful in the UI
    setShowSuccess(true);
    // Reset form after successful booking and (simulated) payment confirmation
    // Note: The latestBooking state and paymentCode are still retained for the success panel.
    setCurrentStep(1); // Go back to step 1 for new booking
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setContactInfo({
      fullName: '',
      phone: '',
      email: '',
      notes: ''
    });
    setPaymentCode(''); // Clear payment code after confirming
  };

  const handleNewBooking = () => {
    setShowSuccess(false);
    setLatestBooking(null);
    setCurrentStep(1);
  };


  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
            step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            {step}
          </div>
          {step < 5 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

 
  // Success Panel Component
  const renderSuccessPanel = () => {
    if (!showSuccess || !latestBooking) return null;

    const renderSuccessPanel = () => {
        if (!showSuccess || !latestBooking) return null;

        return (
            <div className="fixed inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl shadow-lg max-w-sm w-full mx-4 p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-white"/>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Đặt lịch thành công!</h2>

                    <div className="text-left mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cuộc hẹn:</h3>

                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="font-semibold text-gray-700">Dịch vụ: </span>
                                <span className="text-gray-600">{latestBooking.service.serviceName}</span>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">Ngày: </span>
                                <span className="text-gray-600">{formatDate(latestBooking.date)}</span>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">Giờ: </span>
                                <span className="text-gray-600">{latestBooking.time}</span>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">Họ tên: </span>
                                <span className="text-gray-600">{latestBooking.contact.fullName}</span>
                            </div>

                            {latestBooking.contact.age && (
                                <div>
                                    <span className="font-semibold text-gray-700">Tuổi: </span>
                                    <span className="text-gray-600">{latestBooking.contact.age}</span>
                                </div>
                            )}
                            {latestBooking.contact.gender && (
                                <div>
                                    <span className="font-semibold text-gray-700">Giới tính: </span>
                                    <span className="text-gray-600">
      {latestBooking.contact.gender === 'MALE' ? 'Nam' :
          latestBooking.contact.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
    </span>
                                </div>
                            )}


                            <div>
                                <span className="font-semibold text-gray-700">Số điện thoại: </span>
                                <span className="text-gray-600">{latestBooking.contact.phone}</span>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">Email: </span>
                                <span className="text-gray-600">{latestBooking.contact.email}</span>
                            </div>

                            {latestBooking.contact.notes && (
                                <div>
                                    <span className="font-semibold text-gray-700">Ghi chú: </span>
                                    <span className="text-gray-600">{latestBooking.contact.notes}</span>
                                </div>
                            )}

                            {latestBooking.paymentCode && (
                                <div>
                                    <span className="font-semibold text-gray-700">Mã thanh toán: </span>
                                    <span className="text-gray-600 font-mono">{latestBooking.paymentCode}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Chúng tôi sẽ gửi email xác nhận và liên hệ với bạn trước cuộc hẹn 15 phút.
                        </p>
                    </div>

                    <button
                        onClick={handleNewBooking}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        Đặt lịch mới
                    </button>
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                            <MessageSquare className="w-6 h-6 mr-2"/>
                            Chọn dịch vụ tư vấn
                        </h2>
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div
                                    key={service.serviceId}
                                    onClick={() => handleServiceSelect(service)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${selectedService?.serviceId === service.serviceId
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{service.serviceName}</h3>
                                            <p className="text-sm text-gray-600">{service.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-blue-600">
                                                {formatPrice(service.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                            <Calendar className="w-6 h-6 mr-2"/>
                            Chọn ngày tư vấn
                        </h2>
                        <div className="max-w-md">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={getMinDate()}
                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-sm text-gray-600 mt-2">* Chỉ có thể đặt lịch từ ngày mai trở đi</p>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                            <Clock className="w-6 h-6 mr-2"/>
                            Chọn giờ tư vấn
                        </h2>
                        <div className="grid grid-cols-2 gap-3 max-w-md">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 text-sm ${selectedTime === time
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                            <User className="w-6 h-6 mr-2"/>
                            Thông tin liên hệ
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    value={contactInfo.fullName}
                                    onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập họ và tên của bạn"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tuổi *
                                </label>
                                <input
                                    type="number"
                                    value={contactInfo.age}
                                    onChange={(e) => handleContactInfoChange('age', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập tuổi"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới tính *
                                </label>
                                <select
                                    value={contactInfo.gender}
                                    onChange={(e) => handleContactInfoChange('gender', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Phone className="w-4 h-4 mr-1"/>
                                    Số điện thoại *
                                </label>
                                <input
                                    type="tel"
                                    value={contactInfo.phone}
                                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Mail className="w-4 h-4 mr-1"/>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={contactInfo.email}
                                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập địa chỉ email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú (không bắt buộc)
                                </label>
                                <textarea
                                    value={contactInfo.notes}
                                    onChange={(e) => handleContactInfoChange('notes', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Mô tả ngắn gọn về vấn đề cần tư vấn..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                            <QrCode className="w-6 h-6 mr-2" />
                            Thanh toán QR Code
                        </h2>

                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-center max-w-md mx-auto">
                            <div className="flex flex-col items-center mb-4">
                                <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mx-auto shadow-sm" style={{ width: 240, height: 240 }}>
                                    <QRCode
                                        value={`https://img.vietqr.io/image/MB-0396057100-qr_only.png?amount=${selectedService?.price}&addInfo=${paymentCode}`}
                                        size={200}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-3">Quét bằng app ngân hàng để thanh toán</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Số tài khoản:</p>
                                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">0396057100</code>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Nội dung chuyển khoản:</p>
                                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">{paymentCode}</code>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Mã thanh toán:</p>
                                <div className="flex items-center justify-center space-x-2">
                                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">{paymentCode}</code>
                                    <button
                                        onClick={copyPaymentCode}
                                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors rounded hover:bg-blue-50"
                                        title="Sao chép mã"
                                    >
                                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                {copiedCode && <p className="text-xs text-green-600 mt-1">Đã sao chép!</p>}
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-lg font-semibold text-gray-800">
                                    Số tiền: <span className="text-blue-600">{formatPrice(selectedService?.price)}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn thanh toán:</h3>
                            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside text-left">
                                <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                                <li>Chọn chức năng quét QR Code</li>
                                <li>Quét mã QR hoặc nhập mã thanh toán</li>
                                <li>Xác nhận số tiền và thực hiện thanh toán</li>
                                <li>Sau khi thanh toán, nhấn "Xác nhận thanh toán"</li>
                            </ol>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleBack}
                                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handlePaymentConfirmation}
                                disabled={loading}
                                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-2">
                            * Vui lòng chỉ nhấn xác nhận sau khi đã hoàn tất thanh toán
                        </p>
                    </div>

                );

            default:
                return null;
        }
    };


    return (
      <div className="fixed inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg max-w-sm w-full mx-4 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">Đặt lịch thành công!</h2>

          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Thông tin cuộc hẹn:</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Dịch vụ: </span>
                <span className="text-gray-600">{latestBooking.service.name}</span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Ngày: </span>
                <span className="text-gray-600">{formatDate(latestBooking.date)}</span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Giờ: </span>
                <span className="text-gray-600">{latestBooking.time}</span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Họ tên: </span>
                <span className="text-gray-600">{latestBooking.contact.fullName}</span>
              </div>
              {latestBooking.paymentCode && (
                 <div>
                   <span className="font-semibold text-gray-700">Mã thanh toán: </span>
                   <span className="text-gray-600 font-mono">{latestBooking.paymentCode}</span>
                 </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-600 text-sm leading-relaxed">
              Chúng tôi sẽ gửi email xác nhận và liên hệ với bạn trước cuộc hẹn 15 phút.
            </p>
          </div>

          <button
            onClick={handleNewBooking}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Đặt lịch mới
          </button>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Chọn dịch vụ tư vấn
            </h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedService?.id === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">Thời gian: {service.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">{service.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Chọn ngày tư vấn
            </h2>
            <div className="max-w-md">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mm/dd/yyyy"
              />
              <p className="text-sm text-gray-600 mt-2">* Chỉ có thể đặt lịch từ ngày mai trở đi</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Chọn giờ tư vấn
            </h2>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 text-sm ${
                    selectedTime === time
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Thông tin liên hệ
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={contactInfo.fullName}
                  onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (không bắt buộc)
                </label>
                <textarea
                  value={contactInfo.notes}
                  onChange={(e) => handleContactInfoChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả ngắn gọn về vấn đề cần tư vấn..."
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <QrCode className="w-6 h-6 mr-2" />
              Thanh toán QR Code
            </h2>
            
            <div className="max-w-md mx-auto">
              {/* QR Code Display */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-center">
                <div className="w-64 h-64 mx-auto bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">QR Code thanh toán</p>
                  </div>
                </div>
                
                {/* Payment Code */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Mã thanh toán:</p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                      {paymentCode}
                    </code>
                    <button
                      onClick={copyPaymentCode}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Sao chép mã"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copiedCode && (
                    <p className="text-xs text-green-600 mt-1">Đã sao chép!</p>
                  )}
                </div>

                {/* Amount */}
                <div className="border-t pt-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Số tiền: <span className="text-blue-600">{selectedService?.price}</span>
                  </p>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn thanh toán:</h3>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                  <li>Chọn chức năng quét QR Code</li>
                  <li>Quét mã QR hoặc nhập mã thanh toán</li>
                  <li>Xác nhận số tiền và thực hiện thanh toán</li>
                  <li>Sau khi thanh toán, nhấn "Xác nhận thanh toán"</li>
                </ol>
              </div>

              {/* Confirm Payment Button */}
              <button
                onClick={handlePaymentConfirmation}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Xác nhận đã thanh toán
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                * Vui lòng chỉ nhấn xác nhận sau khi đã hoàn tất thanh toán
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Close Button */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 relative">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl font-bold mb-2">Đặt lịch tư vấn trực tuyến</h1>
            <p className="text-blue-100">Chọn dịch vụ và thời gian phù hợp với bạn</p>
          </div>

          <div className="p-8">
            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Step Content */}
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Quay lại
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    canProceedToNextStep()
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Tiếp theo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : currentStep === 4 ? (
                <button
                  onClick={handleConfirmBooking}
                  disabled={!canProceedToNextStep()}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    canProceedToNextStep()
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Tạo đơn đặt lịch
                </button>
              ) : null}
            </div>

            {/* Booking Summary */}
            {(selectedService || selectedDate || selectedTime) && currentStep < 5 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Thông tin đặt lịch:</h3>
                <div className="space-y-2 text-sm">
                  {selectedService && (
                    <p><strong>Dịch vụ:</strong> {selectedService.name} - {selectedService.price}</p>
                  )}
                  {selectedDate && (
                    <p><strong>Ngày:</strong> {formatDate(selectedDate)}</p>
                  )}
                  {selectedTime && (
                    <p><strong>Giờ:</strong> {selectedTime}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Lịch hẹn của bạn</h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{appointment.contact.fullName}</h3>
                      <p className="text-sm text-gray-600">{appointment.service.name}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'PENDING_PAYMENT' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {appointment.status === 'PENDING_PAYMENT' ? 'Chờ thanh toán' : 'Đã xác nhận'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Ngày:</strong> {formatDate(appointment.date)} - {appointment.time}</p>
                    <p><strong>Liên hệ:</strong> {appointment.contact.phone} | {appointment.contact.email}</p>
                    {appointment.paymentCode && (
                      <p><strong>Mã thanh toán:</strong> {appointment.paymentCode}</p>
                    )}
                    <p className="text-xs mt-2">Đặt lúc: {appointment.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {renderSuccessPanel()}
    </div>
  );
};

export default ConsultationBooking;

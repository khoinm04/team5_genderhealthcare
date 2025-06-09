import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, ChevronLeft, ChevronRight, X, CheckCircle, QrCode, Copy, Check } from 'lucide-react';
import axios from 'axios';

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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch services from backend on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/services');
      if (response.ok) {
        const servicesData = await response.json();
        setServices(servicesData);
      } else {
        // Fallback to default services if API call fails
        setServices([
          {
            serviceId: 1,
            serviceName: 'Tư vấn tổng quát',
            category: 'GENERAL_CONSULTATION',
            price: 50.00,
            description: 'Regular health checkup and consultation'
          },
          {
            serviceId: 2,
            serviceName: 'Tư vấn chuyên khoa',
            category: 'SPECIALIST_CONSULTATION',
            price: 100.00,
            description: 'Consultation with specialist doctor'
          },
          {
            serviceId: 3,
            serviceName: 'Tái khám',
            category: 'RE_EXAMINATION',
            price: 30.00,
            description: 'Follow-up consultation'
          },
          {
            serviceId: 4,
            serviceName: 'Tư vấn khẩn cấp',
            category: 'EMERGENCY_CONSULTATION',
            price: 150.00,
            description: 'Urgent medical consultation'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Use fallback services
      setServices([
        {
          serviceId: 1,
          serviceName: 'General Consultation',
          category: 'GENERAL_CONSULTATION',
          price: 50.00,
          description: 'Regular health checkup and consultation'
        },
        {
          serviceId: 2,
          serviceName: 'Specialist Consultation',
          category: 'SPECIALIST_CONSULTATION',
          price: 100.00,
          description: 'Consultation with specialist doctor'
        },
        {
          serviceId: 3,
          serviceName: 'Re-examination',
          category: 'RE_EXAMINATION',
          price: 30.00,
          description: 'Follow-up consultation'
        },
        {
          serviceId: 4,
          serviceName: 'Emergency Consultation',
          category: 'EMERGENCY_CONSULTATION',
          price: 150.00,
          description: 'Urgent medical consultation'
        }
      ]);
    }
  };

  // Time slots matching backend format (HH:mm-HH:mm)
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setError('');
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setError('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setError('');
  };

  const handleContactInfoChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
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
        return true;
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
        const textArea = document.createElement('textarea');
        textArea.value = paymentCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false, degrees, Fahrenheit), 2000);
      }
    }
  };

  const handleConfirmBooking = async () => {
    const userId = Number(sessionStorage.getItem('userId'));

    if (!userId) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    if (!canProceedToNextStep()) return;

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        userId: userId,
        serviceIds: [selectedService.serviceId],
        bookingDate: selectedDate,
        timeSlot: selectedTime,
        customerName: contactInfo.fullName,
        customerPhone: contactInfo.phone,
        customerEmail: contactInfo.email
      };

      const bookingResponse = await axios.post(
        'http://localhost:8080/api/bookings',
        bookingData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = bookingResponse.data;

      // Xử lý dữ liệu trả về, cập nhật state, chuyển bước UI...
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
      setCurrentStep(5);

    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        setError(error.response.data.error || error.response.data.message || 'Có lỗi xảy ra từ server.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };



  const handlePaymentConfirmation = async () => {
    if (!latestBooking) return;

    setLoading(true);
    try {
      // Update booking status to CONFIRMED
      const response = await fetch(`http://localhost:8080/api/bookings/${latestBooking.id}/status?status=CONFIRMED`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const updatedBookingData = await response.json();

        // Update the booking status in local state
        setAppointments(prev =>
          prev.map(appointment =>
            appointment.id === latestBooking.id
              ? { ...appointment, status: 'CONFIRMED' }
              : appointment
          )
        );

        setShowSuccess(true);

        // Reset form
        setCurrentStep(1);
        setSelectedService(null);
        setSelectedDate('');
        setSelectedTime('');
        setContactInfo({
          fullName: '',
          phone: '',
          email: '',
          notes: ''
        });
        setPaymentCode('');
      } else {
        throw new Error('Không thể cập nhật trạng thái thanh toán');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
    }
    finally {
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    setShowSuccess(false);
    setLatestBooking(null);
    setCurrentStep(1);
    setError('');
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
            {step}
          </div>
          {step < 5 && (
            <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderSuccessPanel = () => {
    if (!showSuccess || !latestBooking) return null;

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
              <MessageSquare className="w-6 h-6 mr-2" />
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
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-center">
                <div className="w-64 h-64 mx-auto bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">QR Code thanh toán</p>
                  </div>
                </div>

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

                <div className="border-t pt-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Số tiền: <span className="text-blue-600">{formatPrice(selectedService?.price)}</span>
                  </p>
                </div>
              </div>

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

              <button
                onClick={handlePaymentConfirmation}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
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
            {renderProgressBar()}

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
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
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${canProceedToNextStep()
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
                  disabled={!canProceedToNextStep() || loading}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${canProceedToNextStep() && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {loading ? 'Đang tạo...' : 'Tạo đơn đặt lịch'}
                </button>
              ) : null}
            </div>

            {/* Booking Summary */}
            {(selectedService || selectedDate || selectedTime) && currentStep < 5 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Thông tin đặt lịch:</h3>
                <div className="space-y-2 text-sm">
                  {selectedService && (
                    <p><strong>Dịch vụ:</strong> {selectedService.serviceName} - {formatPrice(selectedService.price)}</p>
                  )}
                  {selectedDate && (
                    <p><strong>Ngày:</strong> {formatDate(selectedDate)}</p>
                  )}
                  {selectedTime && (
                    <p><strong>Giờ:</strong> {selectedTime}</p>
                  )}
                  {contactInfo.fullName && (
                    <p><strong>Họ tên:</strong> {contactInfo.fullName}</p>
                  )}
                  {contactInfo.phone && (
                    <p><strong>Số điện thoại:</strong> {contactInfo.phone}</p>
                  )}
                  {contactInfo.email && (
                    <p><strong>Email:</strong> {contactInfo.email}</p>
                  )}
                  {contactInfo.notes && (
                    <p><strong>Ghi chú:</strong> {contactInfo.notes}</p>
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
                      <h3 className="font-semibold text-gray-800">{appointment.service.serviceName}</h3>
                      <p className="text-sm text-gray-600">Mã thanh toán: {appointment.paymentCode}</p>
                      <p className="text-sm text-gray-600">Trạng thái: {appointment.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">{formatPrice(appointment.service.price)}</p>
                      <p className="text-sm text-gray-600">{formatDate(appointment.date)} | {appointment.time}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Họ tên:</strong> {appointment.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {appointment.contact.phone}</p>
                    <p><strong>Email:</strong> {appointment.contact.email}</p>
                    {appointment.contact.notes && (
                      <p><strong>Ghi chú:</strong> {appointment.contact.notes}</p>
                    )}
                    <p><strong>Ngày tạo:</strong> {appointment.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {renderSuccessPanel()}
    </div>
  );
};

export default ConsultationBooking;
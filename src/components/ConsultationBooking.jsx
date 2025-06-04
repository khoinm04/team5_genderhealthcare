import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CreditCard, QrCode, CheckCircle } from 'lucide-react';

const AppointmentBookingSystem = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Mock user ID - in real app, this would come from authentication
  const userId = 1;

  const API_BASE_URL = 'http://localhost:8080/api';

  // Service categories mapping for Vietnamese display
  const serviceDisplayMap = {
    GENERAL_CONSULTATION: { name: 'Tư vấn tổng quát', duration: '30 phút' },
    SPECIALIST_CONSULTATION: { name: 'Tư vấn chuyên khoa', duration: '45 phút' },
    RE_EXAMINATION: { name: 'Tái khám', duration: '20 phút' },
    EMERGENCY_CONSULTATION: { name: 'Tư vấn khẩn cấp', duration: '60 phút' }
  };

  const timeSlots = [
    '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00',
    '10:00-10:30', '10:30-11:00', '14:00-14:30', '14:30-15:00',
    '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00',
    '19:00-19:30', '19:30-20:00', '20:00-20:30', '20:30-21:00'
  ];

  // Fetch services from backend
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      if (response.ok) {
        const servicesData = await response.json();
        setServices(servicesData);
      } else {
        // Fallback to mock data if API is not available
        setServices([
          { serviceId: 1, serviceName: 'General Consultation', category: 'GENERAL_CONSULTATION', price: 50.00 },
          { serviceId: 2, serviceName: 'Specialist Consultation', category: 'SPECIALIST_CONSULTATION', price: 100.00 },
          { serviceId: 3, serviceName: 'Re-examination', category: 'RE_EXAMINATION', price: 30.00 },
          { serviceId: 4, serviceName: 'Emergency Consultation', category: 'EMERGENCY_CONSULTATION', price: 150.00 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Use fallback data
      setServices([
        { serviceId: 1, serviceName: 'General Consultation', category: 'GENERAL_CONSULTATION', price: 50.00 },
        { serviceId: 2, serviceName: 'Specialist Consultation', category: 'SPECIALIST_CONSULTATION', price: 100.00 },
        { serviceId: 3, serviceName: 'Re-examination', category: 'RE_EXAMINATION', price: 30.00 },
        { serviceId: 4, serviceName: 'Emergency Consultation', category: 'EMERGENCY_CONSULTATION', price: 150.00 }
      ]);
    }
  };

  const formatPrice = (price) => {
    return (price * 1000).toLocaleString('vi-VN') + 'đ'; // Convert to VND (assuming backend price is in USD)
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

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createBooking = async () => {
    try {
      setLoading(true);
      const bookingData = {
        userId: userId,
        serviceIds: [selectedService.serviceId],
        bookingDate: selectedDate,
        timeSlot: selectedTime
      };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const createdBooking = await response.json();
        setBookingId(createdBooking.bookingId);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error creating booking:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    if (paymentMethod === 'qr') {
      setShowQR(true);
      // Simulate QR payment completion after 3 seconds
      setTimeout(async () => {
        const success = await createBooking();
        if (success) {
          setPaymentCompleted(true);
          setShowQR(false);
          setCurrentStep(5);
        }
        setLoading(false);
      }, 3000);
    } else {
      // Simulate card payment completion
      setTimeout(async () => {
        const success = await createBooking();
        if (success) {
          setPaymentCompleted(true);
          setCurrentStep(5);
        }
        setLoading(false);
      }, 2000);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setContactInfo({ name: '', phone: '', email: '', notes: '' });
    setPaymentCompleted(false);
    setBookingId(null);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-0.5 mx-2 ${
              step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (paymentCompleted && currentStep === 5) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt lịch thành công!</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin đặt lịch:</h3>
              <div className="space-y-2 text-left">
                <p><strong>Mã đặt lịch:</strong> #{bookingId}</p>
                <p><strong>Dịch vụ:</strong> {serviceDisplayMap[selectedService?.category]?.name || selectedService?.serviceName}</p>
                <p><strong>Ngày:</strong> {selectedDate}</p>
                <p><strong>Giờ:</strong> {selectedTime}</p>
                <p><strong>Họ tên:</strong> {contactInfo.name}</p>
                <p><strong>Số điện thoại:</strong> {contactInfo.phone}</p>
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Tổng tiền:</strong> {formatPrice(selectedService?.price || 0)}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Chúng tôi sẽ gửi email xác nhận và liên hệ với bạn trước buổi tư vấn.
            </p>
            <button
              onClick={resetForm}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Đặt lịch mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-blue-500 text-white p-6 rounded-t-xl">
          <h1 className="text-2xl font-bold">Đặt lịch tư vấn trực tuyến</h1>
          <p className="text-blue-100 mt-2">Chọn dịch vụ và thời gian phù hợp với bạn</p>
        </div>

        <div className="p-6">
          <StepIndicator />

          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <User className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Chọn dịch vụ tư vấn</h2>
              </div>
              
              <div className="space-y-4">
                {services.map((service) => {
                  const displayInfo = serviceDisplayMap[service.category] || { 
                    name: service.serviceName, 
                    duration: '30 phút' 
                  };
                  
                  return (
                    <div
                      key={service.serviceId}
                      onClick={() => handleServiceSelect(service)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedService?.serviceId === service.serviceId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800">{displayInfo.name}</h3>
                          <p className="text-sm text-gray-600">Thời gian: {displayInfo.duration}</p>
                        </div>
                        <div className="text-blue-500 font-semibold">
                          {formatPrice(service.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedService && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Thông tin đặt lịch:</h3>
                  <p><strong>Dịch vụ:</strong> {serviceDisplayMap[selectedService.category]?.name || selectedService.serviceName} - {formatPrice(selectedService.price)}</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled
                >
                  Quay lại
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedService}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <Calendar className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Chọn ngày tư vấn</h2>
              </div>

              <div className="mb-6">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-red-500 mt-2">* Chỉ có thể đặt lịch từ ngày mai trở đi</p>
              </div>

              {selectedDate && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Thông tin đặt lịch:</h3>
                  <p><strong>Dịch vụ:</strong> {serviceDisplayMap[selectedService.category]?.name || selectedService.serviceName} - {formatPrice(selectedService.price)}</p>
                  <p><strong>Ngày:</strong> {selectedDate}</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedDate}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Chọn giờ tư vấn</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-3 text-center border rounded-lg transition-all text-sm ${
                      selectedTime === time
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {selectedTime && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Thông tin đặt lịch:</h3>
                  <p><strong>Dịch vụ:</strong> {serviceDisplayMap[selectedService.category]?.name || selectedService.serviceName} - {formatPrice(selectedService.price)}</p>
                  <p><strong>Ngày:</strong> {selectedDate}</p>
                  <p><strong>Giờ:</strong> {selectedTime}</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedTime}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Info & Payment */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center mb-6">
                <User className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Thông tin liên hệ & Thanh toán</h2>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={contactInfo.name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú (không bắt buộc)
                    </label>
                    <textarea
                      value={contactInfo.notes}
                      onChange={(e) => handleContactChange('notes', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập ghi chú nếu có"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span>Thẻ tín dụng / Thẻ ghi nợ</span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="qr"
                      checked={paymentMethod === 'qr'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <QrCode className="w-5 h-5 mr-2" />
                    <span>Quét mã QR</span>
                  </label>
                </div>
              </div>

              {/* QR Code Display */}
              {showQR && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl max-w-sm w-full mx-4">
                    <h3 className="text-lg font-semibold text-center mb-4">Quét mã QR để thanh toán</h3>
                    <div className="bg-gray-100 p-8 rounded-lg text-center mb-4">
                      <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600 mt-2">Mã QR thanh toán</p>
                    </div>
                    <p className="text-center text-sm text-gray-600 mb-4">
                      Số tiền: {formatPrice(selectedService.price)}
                    </p>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Đang xử lý thanh toán và tạo lịch hẹn...
                    </p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Tóm tắt đơn hàng:</h3>
                <div className="space-y-1">
                  <p><strong>Dịch vụ:</strong> {serviceDisplayMap[selectedService.category]?.name || selectedService.serviceName}</p>
                  <p><strong>Ngày:</strong> {selectedDate}</p>
                  <p><strong>Giờ:</strong> {selectedTime}</p>
                  <p><strong>Thời gian:</strong> {serviceDisplayMap[selectedService.category]?.duration || '30 phút'}</p>
                  <hr className="my-2" />
                  <p className="text-lg font-bold text-blue-600">
                    <strong>Tổng tiền: {formatPrice(selectedService.price)}</strong>
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Quay lại
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!contactInfo.name || !contactInfo.phone || !contactInfo.email || loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
                  Xác nhận & Thanh toán
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingSystem;
import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ConsultationBooking = ({ onClose }) => {
   useState(() => {
    window.scrollTo(0, 0);
  }, []);
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

  const services = [
    {
      id: 'general',
      name: 'Tư vấn tổng quát',
      duration: '30 phút',
      price: '200,000đ'
    },
    {
      id: 'specialist',
      name: 'Tư vấn chuyên khoa',
      duration: '45 phút',
      price: '350,000đ'
    },
    {
      id: 'recheck',
      name: 'Tái khám',
      duration: '20 phút',
      price: '150,000đ'
    },
    {
      id: 'urgent',
      name: 'Tư vấn khẩn cấp',
      duration: '60 phút',
      price: '500,000đ'
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
    '19:00', '19:30', '20:00', '20:30'
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
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    if (canProceedToNextStep()) {
      const newAppointment = {
        id: Date.now(),
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        contact: contactInfo,
        status: 'confirmed',
        createdAt: new Date().toLocaleString('vi-VN')
      };

      try {
        const response = await axios.post('http://localhost:8080/api/bookings', newAppointment);
        console.log('Đặt lịch thành công:', response.data);
        setAppointments([...appointments, newAppointment]);
        setLatestBooking(newAppointment);
        setShowSuccess(true);
      } catch (error) {
        console.error('Lỗi khi gửi đặt lịch:', error);
        alert("Có lỗi xảy ra khi đặt lịch.");
      }
    }
  };

  const handleNewBooking = () => {
    setShowSuccess(false);
    setLatestBooking(null);
    setCurrentStep(1);
  };
  
// eslint-disable-next-line no-unused-vars
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setLatestBooking(null);
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
            step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
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

    return (
      <div className="fixed inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-lg max-w-sm w-full mx-4 p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Success Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Đặt lịch thành công!</h2>

          {/* Booking Details */}
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
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="mb-8">
            <p className="text-gray-600 text-sm leading-relaxed">
              Chúng tôi sẽ gửi email xác nhận và liên hệ với bạn trước cuộc hẹn 15 phút.
            </p>
          </div>

          {/* Action Button */}
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
            <div className="grid grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
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
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={!canProceedToNextStep()}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    canProceedToNextStep()
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Xác nhận đặt lịch
                </button>
              )}
            </div>

            {/* Booking Summary */}
            {(selectedService || selectedDate || selectedTime) && (
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
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Đã xác nhận
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Ngày:</strong> {formatDate(appointment.date)} - {appointment.time}</p>
                    <p><strong>Liên hệ:</strong> {appointment.contact.phone} | {appointment.contact.email}</p>
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
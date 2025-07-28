// src/components/BookingSuccess.jsx
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


const BookingSuccess = ({ serviceName, date, time, fullName, price, email, phone, bookingType }) => {
  const navigate = useNavigate();
  return (
    <div className="text-center max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h2>
        <p className="text-lg text-gray-600">
          Cảm ơn bạn đã đặt lịch. Chúng tôi sẽ liên hệ với bạn sớm nhất.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Thông tin lịch hẹn</h3>
        <div className="space-y-2 text-left">
          <p className="text-green-700">
            <span className="font-medium">Dịch vụ:</span> {serviceName}
          </p>
          <p className="text-green-700">
            <span className="font-medium">Ngày:</span> {date}
          </p>
          <p className="text-green-700">
            <span className="font-medium">Giờ:</span> {time}
          </p>
          <p className="text-green-700">
            <span className="font-medium">Họ tên:</span> {fullName}
          </p>
          {/* <p className="text-green-700">
            <span className="font-medium">Số tiền:</span> {price}
          </p> */}
          <p className="text-green-700">
            <span className="font-medium">Trạng thái:</span>{" "}
            <span className="text-green-600 font-semibold">ĐÃ THANH TOÁN</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          Một email xác nhận đã được gửi đến <strong>{email}</strong>
        </p>
        <p className="text-gray-600">
          Chúng tôi sẽ gọi điện xác nhận lịch hẹn qua số <strong>{phone}</strong>
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
          onClick={() => navigate(`/booking/${bookingType}`)} className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Đặt lịch khác
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;

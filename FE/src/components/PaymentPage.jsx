import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import QRCode from "react-qr-code";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { paymentCode, amount, testName, bookingId } = state || {};
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
  if (!paymentCode || !amount || !testName || !bookingId) {
    alert("Thông tin thanh toán không hợp lệ. Vui lòng thử lại.");
    navigate("/booking/sti?tab=book-test");
    return;
  }

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch initial booking details
  axios
    .get(`/api/bookings/payment/${paymentCode}`, config)
    .then((response) => {
      setBookingDetails(response.data);
      if (response.data.status === "CONFIRMED") {
        setPaymentStatus("completed");
      }
    })
    .catch((err) => {
      console.error("Lỗi lấy chi tiết booking:", err);
      alert("Không thể tải thông tin booking. Vui lòng thử lại.");
      navigate("/booking/sti?tab=book-test");
    });

  // Countdown timer
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 0) {
        clearInterval(timer);
        setPaymentStatus("timeout");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  // Poll payment status
  const pollPayment = setInterval(() => {
    axios
      .get(`/api/bookings/payment/${paymentCode}`, config)
      .then((response) => {
        if (response.data.status === "CONFIRMED") {
          clearInterval(pollPayment);
          clearInterval(timer);
          setPaymentStatus("completed");
          setBookingDetails(response.data);
          setTimeout(() => {
            navigate("/booking/sti?tab=results");
          }, 3000);
        }
      })
      .catch((err) => {
        console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
      });
  }, 5000);

  return () => {
    clearInterval(timer);
    clearInterval(pollPayment);
  };
}, [paymentCode, amount, testName, bookingId, navigate]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleCancel = () => {
    axios
      .post(
        `/api/bookings/${bookingId}/cancel`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        alert("Đã hủy đặt lịch. Bạn sẽ được chuyển về trang đặt lịch.");
        navigate("/booking/sti?tab=book-test");
      })
      .catch((err) => {
        console.error("Lỗi hủy đặt lịch:", err);
        alert("Không thể hủy đặt lịch. Vui lòng thử lại.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Thanh toán đặt lịch xét nghiệm
        </h2>

        {paymentStatus === "pending" && (
          <>
            <div className="flex justify-center mb-6">
              <QRCode value={paymentCode} size={200} />
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-gray-900">
                Quét mã QR để thanh toán
              </p>
              <p className="text-sm text-gray-600">
                Vui lòng sử dụng ứng dụng ngân hàng để quét mã QR và hoàn tất thanh toán.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Thời gian còn lại: <span className="font-bold">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Mã thanh toán:</span>
                <span className="text-sm text-gray-900">{paymentCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Dịch vụ:</span>
                <span className="text-sm text-gray-900">{testName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Số tiền:</span>
                <span className="text-sm text-purple-600 font-bold">
                  {amount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="w-full mt-6 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Hủy đặt lịch
            </button>
          </>
        )}

        {paymentStatus === "completed" && (
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-4">
              Thanh toán thành công!
            </h3>
            <p className="text-gray-600 mb-6">
              Đặt lịch xét nghiệm của bạn đã được xác nhận. Bạn sẽ được chuyển về trang kết quả.
            </p>
          </div>
        )}

        {paymentStatus === "timeout" && (
          <div className="text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-4">
              Hết thời gian thanh toán
            </h3>
            <p className="text-gray-600 mb-6">
              Phiên thanh toán đã hết hạn. Vui lòng đặt lịch lại.
            </p>
            <button
              onClick={() => navigate("/api/bookings")}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Quay lại đặt lịch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
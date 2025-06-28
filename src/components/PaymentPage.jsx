import { useEffect, useState } from "react";
<<<<<<< HEAD
import { QrCode, Check, Copy } from "lucide-react";

const PaymentPage = () => {
  // Mock data since we don't have router state
  const mockState = {
    paymentCode: "PAY123456789",
    amount: 500000,
    testName: "Xét nghiệm STI cơ bản",
    bookingId: "BOOK001"
  };

  const { paymentCode, amount, testName, bookingId } = mockState;
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!paymentCode || !amount || !testName || !bookingId) {
      alert("Thông tin thanh toán không hợp lệ. Vui lòng thử lại.");
      // In real app: navigate("/booking/sti?tab=book-test");
    }
  }, [paymentCode, amount, testName, bookingId]);

  const formatPrice = (price) => {
    return `${price?.toLocaleString("vi-VN")} đ`;
  };

  const copyPaymentCode = () => {
    navigator.clipboard.writeText(paymentCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handlePaymentConfirmation = () => {
    setLoading(true);

    // Mock API call simulation
    setTimeout(() => {
      const isPaymentConfirmed = Math.random() > 0.3; // 70% success rate for demo

      if (isPaymentConfirmed) {
        alert("Thanh toán thành công! Bạn sẽ được chuyển về trang kết quả.");
        // In real app: navigate("/booking/sti?tab=results");
      } else {
        alert("Hệ thống chưa ghi nhận thanh toán. Vui lòng đợi hoặc thử lại sau.");
      }
      setLoading(false);
    }, 2000);
  };

  const handleCancelPayment = () => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy thanh toán?");
    if (confirmCancel) {
      // In real app: navigate(-1) or history.back()
      // For demo, we'll simulate going back
      window.history.back();
    }
  };

  // Realistic QR code representation based on the provided image
  const QRCodeDisplay = ({ value, size }) => {
    // Create a more realistic QR pattern similar to the provided image
    const generateQRPattern = () => {
      const gridSize = 25;
      const pattern = [];

      for (let row = 0; row < gridSize; row++) {
        let rowPattern = '';
        for (let col = 0; col < gridSize; col++) {
          // Position detection patterns (corners)
          if ((row < 7 && col < 7) || (row < 7 && col >= 18) || (row >= 18 && col < 7)) {
            // Create finder patterns
            if ((row === 0 || row === 6) && (col >= 0 && col <= 6)) rowPattern += '█';
            else if ((col === 0 || col === 6) && (row >= 0 && row <= 6)) rowPattern += '█';
            else if (row >= 2 && row <= 4 && col >= 2 && col <= 4) rowPattern += '█';
            else rowPattern += '░';
          }
          // Timing patterns
          else if (row === 6 || col === 6) {
            rowPattern += (row + col) % 2 === 0 ? '█' : '░';
          }
          // Data area with pseudo-random pattern
          else {
            const hash = (row * 31 + col * 17 + value.length) % 100;
            rowPattern += hash < 45 ? '█' : '░';
          }
        }
        pattern.push(rowPattern);
      }
      return pattern;
    };

    const qrPattern = generateQRPattern();

    return (
      <div
        className="bg-white border-2 border-gray-300 rounded-lg p-4 mx-auto shadow-sm"
        style={{ width: size, height: size }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-white p-3 rounded border">
            <div className="font-mono text-[6px] leading-none">
              {qrPattern.map((row, i) => (
                <div key={i} className="whitespace-nowrap">
                  {row.split('').map((char, j) => (
                    <span
                      key={j}
                      className={char === '█' ? 'bg-black' : 'bg-white'}
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        fontSize: '6px'
                      }}
                    >
                      {char === '█' ? '█' : '░'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-blue-600 font-medium text-center mt-2">
            QR Code<br />
            <span className="text-[10px] text-gray-500">VietQR Payment</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
      <div className="max-w-xl w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
          <QrCode className="w-6 h-6 mr-2" />
          Thanh toán QR Code
        </h2>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-center">
          <div className="flex flex-col items-center mb-4">
            <img
              src="https://img.vietqr.io/image/MB-0396057100-qr_only.png?amount=500000&addInfo=PAY123456789"
              alt="QR Code VietQR"
              width={240}
              height={240}
              className="border-2 border-gray-300 rounded-lg shadow-sm"
            />
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
              Số tiền: <span className="text-blue-600">{formatPrice(amount)}</span>
            </p>
          </div>a
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
            onClick={handleCancelPayment}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Hủy thanh toán
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
=======
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
>>>>>>> 5baec3af8f463cce850f68938b652c2447704054
      </div>
    </div>
  );
};

export default PaymentPage;
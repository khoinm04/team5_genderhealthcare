import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QrCode, Check, Copy } from "lucide-react";
import QRCode from "react-qr-code";
import axios from "axios";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { paymentCode, amount, testName, bookingId } = state || {};
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!paymentCode || !amount || !testName || !bookingId) {
      alert("Thông tin thanh toán không hợp lệ. Vui lòng thử lại.");
      navigate("/booking/sti?tab=book-test");
    }
  }, [paymentCode, amount, testName, bookingId, navigate]);

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
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
        .get(`/api/bookings/payment/${paymentCode}`, config)
        .then((response) => {
          if (response.data.status === "CONFIRMED") {
            alert("Thanh toán thành công! Bạn sẽ được chuyển về trang kết quả.");
            navigate("/booking/sti?tab=results");
          } else {
            alert("Hệ thống chưa ghi nhận thanh toán. Vui lòng đợi hoặc thử lại sau.");
          }
        })
        .catch((err) => {
          console.error("Lỗi xác nhận thanh toán:", err);
          alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
        })
        .finally(() => {
          setLoading(false);
        });
  };

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
        <div className="max-w-xl w-full">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
            <QrCode className="w-6 h-6 mr-2" />
            Thanh toán QR Code
          </h2>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-center">
            <div className="w-64 h-64 mx-auto bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <QRCode
                    value={`https://img.vietqr.io/image/MB-0396057100-qr_only.png?amount=${amount}&addInfo=${paymentCode}`}
                    size={240}
                />
                <p className="text-sm text-gray-500 mt-2">Quét bằng app ngân hàng để thanh toán</p>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">Số tài khoản:</p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">0396057100</code>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Nội dung chuyển khoản:</p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">{paymentCode}</code>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Mã thanh toán:</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">{paymentCode}</code>
                <button
                    onClick={copyPaymentCode}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
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

          <button
              onClick={handlePaymentConfirmation}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            * Vui lòng chỉ nhấn xác nhận sau khi đã hoàn tất thanh toán
          </p>
        </div>
      </div>
  );
};

export default PaymentPage;

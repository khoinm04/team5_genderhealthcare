import { useEffect, useState } from "react";
import axios from "axios";
import { QrCode, Check, Copy, Loader2, CheckCircle, XCircle } from "lucide-react";

const PaymentPage = ({ paymentCode, amount, testName, bookingId, onCancel, onSuccess }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    console.log("paymentCode:", paymentCode);
    console.log("amount:", amount);
    console.log("testName:", testName);
    console.log("bookingId:", bookingId);

    if (!paymentCode || !amount || !testName || !bookingId) {
      alert("Thông tin thanh toán không hợp lệ. Vui lòng thử lại.");
    }
  }, [paymentCode, amount, testName, bookingId]);


  const formatPrice = (price) => `${price?.toLocaleString("vi-VN")} đ`;

  const copyPaymentCode = () => {
    navigator.clipboard.writeText(paymentCode).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handlePaymentConfirmation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.patch(`/api/bookings/confirm-payment`, null, {
        params: { paymentCode },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPaymentSuccess();
      pollForCompletedStatus();
    } catch (err) {
      alert("Lỗi khi xác nhận thanh toán. Vui lòng thử lại.");
      setLoading(false);
    }
  };


  const pollForCompletedStatus = () => {
    const startTime = Date.now();
    const timeout = 60000;
    const token = localStorage.getItem("token");

    const interval = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > timeout) {
        clearInterval(interval);
        await handleAutoCancel();
        return;
      }

      try {
        const res = await axios.get(`/api/bookings/payment/${paymentCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const status = res.data?.status;
        console.log("✅ Trạng thái từ API:", status);

        if (status?.toUpperCase() === "COMPLETED") {
          clearInterval(interval);
          setPaymentSuccess(true);
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 1000);
        }
      } catch (err) {
        console.error("❌ Lỗi khi kiểm tra trạng thái booking:", err);
      }
    }, 5000);
  };



  const handleAutoCancel = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(`/api/bookings/cancel`, null, {
        params: { paymentCode },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPaymentFailed(true);
      if (onCancel) onCancel();
    } catch (err) {
      alert("Lỗi khi hủy đặt lịch: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };


  const handleCancelPayment = () => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy thanh toán?");
    if (confirmCancel && onCancel) {
      onCancel();
    }
  };

  const LoadingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
        <h3 className="text-lg font-semibold text-gray-800 mt-4">Đang xác nhận thanh toán</h3>
        <p className="text-sm text-gray-600">Vui lòng đợi trong giây lát...</p>
      </div>
    </div>
  );

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-800 mt-4">Thanh toán thành công!</h3>
        <p className="text-sm text-gray-600">Đang chuyển về trang chủ...</p>
      </div>
    </div>
  );

  const FailureModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <XCircle className="w-12 h-12 text-red-600 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-800 mt-4">Đặt lịch không thành công</h3>
        <p className="text-sm text-gray-600">Không nhận được xác nhận trong vòng 1 phút</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
      <div className="max-w-xl w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
          <QrCode className="w-6 h-6 mr-2" /> Thanh toán QR Code
        </h2>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-center">
          <img
            src={`https://img.vietqr.io/image/MB-0396057100-qr_only.png?amount=${amount}&addInfo=${paymentCode}`}
            alt="QR Code"
            width={240}
            height={240}
            className="mx-auto border-2 border-gray-300 rounded-lg shadow-sm"
          />
          <p className="text-sm text-gray-500 mt-3">Quét bằng app ngân hàng để thanh toán</p>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Số tài khoản:</p>
            <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">0396057100</code>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Mã thanh toán:</p>
            <div className="flex items-center justify-center space-x-2">
              <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">{paymentCode}</code>
              <button
                onClick={copyPaymentCode}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copiedCode && <p className="text-xs text-green-600 mt-1">Đã sao chép!</p>}
          </div>

          <p className="mt-4 text-lg font-semibold text-gray-800">
            Số tiền: <span className="text-blue-600">{formatPrice(amount)}</span>
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCancelPayment}
            disabled={loading || paymentSuccess}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            Hủy thanh toán
          </button>
          <button
            onClick={handlePaymentConfirmation}
            disabled={loading || paymentSuccess}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {paymentSuccess ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Đã thanh toán
              </span>
            ) : (
              "Xác nhận đã thanh toán"
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-2">
          * Vui lòng chỉ nhấn xác nhận sau khi đã hoàn tất thanh toán
        </p>
      </div>

      {loading && <LoadingModal />}
      {paymentSuccess && <SuccessModal />}
      {paymentFailed && <FailureModal />}
    </div>
  );
};

export default PaymentPage;

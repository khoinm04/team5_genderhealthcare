import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentVnpayPage = () => {
  const location = useLocation();
  const { paymentUrl } = location.state || {};

  useEffect(() => {
    if (!paymentUrl) return;

    // ✅ Inject biến timer trước khi script của VNPAY chạy
    const timerScript = document.createElement("script");
    timerScript.innerHTML = "var timer = 900;"; // Thời gian đếm ngược 15 phút
    document.head.appendChild(timerScript);

    // ✅ Inject script của VNPAY
    const vnpayScript = document.createElement("script");
    vnpayScript.src = "https://sandbox.vnpayment.vn/paymentv2/lib/js/custom.min.js";
    vnpayScript.async = true;
    document.body.appendChild(vnpayScript);

    return () => {
      document.head.removeChild(timerScript);
      document.body.removeChild(vnpayScript);
    };
  }, [paymentUrl]);

  if (!paymentUrl) {
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-bold">Không tìm thấy thông tin thanh toán</h2>
        <p>Vui lòng quay lại và thử lại quy trình đặt lịch.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Thanh toán VNPAY</h2>
      <iframe
        src={paymentUrl}
        width="100%"
        height="600"
        style={{ border: "none", maxWidth: "700px" }}
        title="VNPAY Payment"
      />
    </div>
  );
};

export default PaymentVnpayPage;

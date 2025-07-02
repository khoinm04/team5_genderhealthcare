import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BookingSuccess from "../components/BookingSuccess"; // Đường dẫn đúng với project bạn

const PaymentStiSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingId = state?.bookingId;

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      navigate("/");
      return;
    }

    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBooking(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy booking:", err);
        navigate("/");
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  if (!booking) return <p className="text-center mt-20 text-gray-500">Đang tải thông tin...</p>;

  return (
    <BookingSuccess
  serviceName={booking.serviceName || "Dịch vụ xét nghiệm"} // fallback nếu null
  date={booking.bookingDate}
  time={booking.timeSlot}
  fullName={booking.customerName}
  price={`${booking.amount?.toLocaleString("vi-VN")} đ`}
  email={booking.customerEmail}
  phone={booking.customerPhone}
/>

  );
};

export default PaymentStiSuccess;

import { useLocation } from "react-router-dom";
import BookingSuccess from "./BookingSuccess"; // Nếu cũng nằm trong components

const BookingSuccessWrapper = () => {
  const { state } = useLocation();

  if (!state) {
    return <div className="text-center text-red-500 py-10">Không có thông tin đặt lịch!</div>;
  }

  // Tự động xác định bookingType nếu chưa có
  const serviceName = state.serviceName || state.testName || "";
  const inferredBookingType = state.bookingType || inferBookingType(serviceName);


  return (
    <BookingSuccess
      serviceName={state.serviceName || state.testName}
      date={state.date}
      time={state.time}
      fullName={state.fullName}
      price={state.amount ? `${state.amount.toLocaleString("vi-VN")} đ` : "Miễn phí"}
      email={state.email}
      phone={state.phone}
      bookingType={inferredBookingType}
    />
  );

  function inferBookingType(serviceName) {
  const name = serviceName.toLowerCase();
  if (name.includes("tư vấn") || name.includes("consultation")) return "consultation";
  if (name.includes("sti") || name.includes("xét nghiệm")) return "sti";
  return "sti"; // fallback mặc định
}
};

export default BookingSuccessWrapper;

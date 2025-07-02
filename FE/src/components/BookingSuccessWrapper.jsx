import { useLocation } from "react-router-dom";
import BookingSuccess from "./BookingSuccess"; // Nếu cũng nằm trong components

const BookingSuccessWrapper = () => {
  const { state } = useLocation();

  if (!state) {
    return <div className="text-center text-red-500 py-10">Không có thông tin đặt lịch!</div>;
  }

  return (
    <BookingSuccess
      serviceName={state.testName}
      date={state.date}
      time={state.time}
      fullName={state.fullName}
      price={state.amount ? `${state.amount.toLocaleString("vi-VN")} đ` : "Miễn phí"}
      email={state.email}
      phone={state.phone}
    />
  );
};

export default BookingSuccessWrapper;

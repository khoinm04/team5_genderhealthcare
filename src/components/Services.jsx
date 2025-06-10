import React from "react";
import ServiceCard from "./ServiceCard";

const servicesData = [
  {
    title: "Theo dõi chu kỳ sinh sản",
    description: "Theo dõi chu kỳ kinh nguyệt, nhắc nhở thời gian rụng trứng, khả năng mang thai và uống thuốc tránh thai.",
    icon: "📅",
    link: "/menstrual-cycle",      // <-- link riêng
  },
  {
    title: "Đặt lịch tư vấn trực tuyến",
    description: "Cho phép người dùng đặt lịch hẹn tư vấn với chuyên viên y tế qua hệ thống trực tuyến.",
    icon: "📞",
    link: "/booking",              // <-- link riêng
  },
  {
    title: "Dịch vụ xét nghiệm STIs",
    description: "Quản lý quá trình xét nghiệm các bệnh lây truyền qua đường tình dục từ đặt lịch đến trả kết quả.",
    icon: "🧪",
    link: "/booking/sti",          // <-- link riêng
  },
  {
    title: "Hỏi đáp với tư vấn viên",
    description: "Gửi câu hỏi và nhận giải đáp từ tư vấn viên chuyên môn về mọi vấn đề sức khỏe giới tính.",
    icon: "💬",
    // không có link cũng được
  },
];

export default function Services() {
  return (
    <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {servicesData.map(({ title, description, icon, link }) => (
        <ServiceCard
          key={title}
          title={title}
          description={description}
          icon={icon}
          link={link}               // <-- truyền prop link
          className="w-full"
        />
      ))}
    </div>
  );
}

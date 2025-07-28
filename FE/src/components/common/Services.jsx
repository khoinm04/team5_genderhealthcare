import React from "react";
import ServiceCard from "./ServiceCard";

const servicesData = [
  {
    title: "Theo dõi chu kỳ sinh sản",
    description: "Theo dõi chu kỳ kinh nguyệt, nhắc nhở thời gian rụng trứng, khả năng mang thai và uống thuốc tránh thai.",
    icon: "📅",
    navigateTo: "/booking/menstrual",

  },
  {
    title: "Đặt lịch tư vấn trực tuyến",
    description: "Cho phép người dùng đặt lịch hẹn tư vấn với chuyên viên y tế qua hệ thống trực tuyến.",
    icon: "📞",
    navigateTo: "/booking/consultation",

  },
  {
    title: "Đặt lịch xét nghiệm STIs",
    description: "Quản lý quá trình xét nghiệm các bệnh lây truyền qua đường tình dục từ đặt lịch đến trả kết quả.",
    icon: "🧪",
    navigateTo: "/booking/sti",

  },
  {
    title: "Hỏi đáp với tư vấn viên",
    description: "Gửi câu hỏi và nhận giải đáp từ tư vấn viên chuyên môn.",
    icon: "💬",
  },
];


export default function Services() {
  return (
    <div className="flex flex-wrap justify-between self-stretch mx-4 gap-6">
      {servicesData.map(({ title, description, icon,navigateTo }) => (
        <ServiceCard
          key={title}
          title={title}
          description={description}
          icon={icon}
          navigateTo={navigateTo}
          className="flex-shrink-0 w-full sm:w-[48%] lg:w-[31%]"
        />
      ))}
    </div>
  );
}

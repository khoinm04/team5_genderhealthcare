import React from "react";
import ServiceCard from "./ServiceCard";

const servicesData = [
  {
    title: "Quản lý dịch vụ xét nghiệm STIs",
    description:
      "Quản lý quá trình xét nghiệm các bệnh lây truyền qua đường tình dục từ đặt lịch đến trả kết quả.",
    icon: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
  },
  {
    title: "Theo dõi chu kỳ sinh sản",
    description:
      "Theo dõi chu kỳ kinh nguyệt, nhắc nhở thời gian rụng trứng, khả năng mang thai và uống thuốc tránh thai.",
    icon: "https://cdn-icons-png.flaticon.com/512/2921/2921220.png",
  },
  {
    title: "Đặt lịch tư vấn trực tuyến",
    description:
      "Cho phép người dùng đặt lịch hẹn tư vấn với chuyên viên y tế qua hệ thống trực tuyến.",
    icon: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
  },
  {
    title: "Hỏi đáp với tư vấn viên",
    description: "Gửi câu hỏi và nhận giải đáp từ tư vấn viên chuyên môn.",
    icon: "https://cdn-icons-png.flaticon.com/512/2917/2917242.png",
  },
  {
    title: "Quản lý thông tin tư vấn viên",
    description:
      "Quản lý hồ sơ, bằng cấp, kinh nghiệm và lịch làm việc của tư vấn viên.",
    icon: "https://cdn-icons-png.flaticon.com/512/2921/2921277.png",
  },
  {
    title: "Quản lý rating & feedback",
    description:
      "Thu thập và quản lý đánh giá, phản hồi của người dùng về dịch vụ và tư vấn viên.",
    icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  },
  {
    title: "Quản lý hồ sơ người dùng",
    description:
      "Lưu trữ thông tin cá nhân và lịch sử dịch vụ xét nghiệm, tư vấn.",
    icon: "https://cdn-icons-png.flaticon.com/512/2921/2921277.png",
  },
  {
    title: "Dashboard & Báo cáo",
    description:
      "Tổng hợp và phân tích dữ liệu để hỗ trợ quản lý dịch vụ hiệu quả.",
    icon: "https://cdn-icons-png.flaticon.com/512/1256/1256650.png",
  },
  {
    title: "Khai báo bảng giá dịch vụ",
    description:
      "Quản lý và cập nhật bảng giá các dịch vụ xét nghiệm y tế.",
    icon: "https://cdn-icons-png.flaticon.com/512/263/263115.png",
  },
];

export default function Services() {
  return (
    <div className="flex flex-wrap justify-between self-stretch mx-4 gap-6">
      {servicesData.map(({ title, description, icon }) => (
        <ServiceCard
          key={title}
          title={title}
          description={description}
          icon={icon}
          className="flex-shrink-0 w-full sm:w-[48%] lg:w-[31%]"
        />
      ))}
    </div>
  );
}

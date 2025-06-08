import React from "react";
import BlogList from "../components/BlogList";


// Danh sách bài viết (chỉ summary, slug, image, date) – đồng bộ slug với BlogPost.jsx
const blogs = [
  {
    title: "Giáo dục giới tính – Bước đầu cho sự trưởng thành",
    date: "2024-06-08",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    summary: "Chủ động tìm hiểu về giới tính giúp bạn trưởng thành, tự tin và hạnh phúc hơn.",
    link: "/blog/giao-duc-gioi-tinh",
  },
  {
    title: "Vì sao cần xét nghiệm STIs định kỳ – Đừng để sức khỏe sinh sản là điều may rủi",
    date: "2024-06-07",
    image: "https://images.unsplash.com/photo-1511174511562-5f97f4f4e0c8?auto=format&fit=crop&w=800&q=80",
    summary: "Xét nghiệm định kỳ giúp phát hiện sớm, điều trị kịp thời và bảo vệ cả bản thân lẫn cộng đồng.",
    link: "/blog/xet-nghiem-stis-dinh-ky",
  },
  {
    title: "Những hiểu lầm tai hại về sức khỏe sinh sản ở người trẻ",
    date: "2024-06-06",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    summary: "Nhiều người nghĩ 'khỏe mạnh thì không thể mắc STIs' hoặc 'chỉ nữ mới lo sinh sản' – đều là sai lầm. Hãy cập nhật kiến thức đúng để chủ động bảo vệ mình.",
    link: "/blog/hieu-lam-suc-khoe-sinh-san",
  },
  {
    title: "Trải nghiệm khám sức khỏe sinh sản lần đầu – Không đáng sợ như bạn nghĩ!",
    date: "2024-06-05",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    summary: "Khám sức khỏe sinh sản thực tế rất nhẹ nhàng, bảo mật và chuyên nghiệp. Sau khi trải nghiệm, bạn sẽ cảm thấy yên tâm và tự tin hơn.",
    link: "/blog/kham-suc-khoe-sinh-san-lan-dau",
  },
  {
    title: "Dịch vụ xét nghiệm STIs – Chọn phòng khám uy tín để an tâm hơn",
    date: "2024-06-04",
    image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=800&q=80",
    summary: "Hãy chọn phòng khám uy tín với bác sĩ chuyên khoa, quy trình rõ ràng và bảo mật để đảm bảo kết quả xét nghiệm chính xác và an tâm.",
    link: "/blog/dich-vu-xet-nghiem-stis",
  },
  {
    title: "Các dấu hiệu cảnh báo bệnh lây truyền qua đường tình dục không nên bỏ qua",
    date: "2024-06-03",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
    summary: "Ngứa, rát, đau khi quan hệ, dịch tiết bất thường có thể là dấu hiệu cảnh báo STIs. Chủ động đi kiểm tra khi có dấu hiệu bất thường.",
    link: "/blog/dau-hieu-canh-bao-stis",
  },
  {
    title: "Sống khỏe mạnh, chủ động bảo vệ sức khỏe giới tính – Bí quyết cho hạnh phúc lâu dài",
    date: "2024-06-02",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    summary: "Chủ động dùng biện pháp bảo vệ, khám sức khỏe định kỳ và tìm hiểu thông tin từ nguồn uy tín là chìa khóa cho một cuộc sống hạnh phúc, khỏe mạnh.",
    link: "/blog/song-khoe-manh-gioi-tinh",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Các bài viết về chăm sóc sức khỏe giới tính</h2>
      <BlogList blogs={blogs} />
    </div>
  );
}

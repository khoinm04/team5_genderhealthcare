import React from "react";
import BlogCard from "./BlogCard";

const blogPosts = [
  {
    title: "Navigating the world of gender affirming care",
    date: "Apr 12, 2022",
    image:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/xg7wbw1n_expires_30_days.png",
    summary:
      "Hiểu và tiếp cận các dịch vụ chăm sóc xác nhận giới tính giúp bạn tự tin hơn trong hành trình của mình.",
    link: "#",
  },
  {
    title: "What to expect when starting hormone therapy",
    date: "Mar 30, 2022",
    image:
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/tnhixw7a_expires_30_days.png",
    summary:
      "Hướng dẫn chi tiết về quá trình bắt đầu điều trị hormone, những điều cần lưu ý và kinh nghiệm thực tế.",
    link: "#",
  },
  {
    title: "Understanding sexual health basics",
    date: "Feb 15, 2022",
    image:
      "https://images.unsplash.com/photo-1532619675605-9d30a876db29?auto=format&fit=crop&w=800&q=80",
    summary:
      "Các kiến thức cơ bản về sức khỏe tình dục và cách duy trì sự an toàn cho bản thân.",
    link: "#",
  },
  {
    title: "Mental health and gender identity",
    date: "Jan 20, 2022",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    summary:
      "Vai trò của sức khỏe tinh thần trong hành trình xác định và chấp nhận giới tính.",
    link: "#",
  },
  {
    title: "Preventing STIs: What you need to know",
    date: "Dec 5, 2021",
    image:
      "https://images.unsplash.com/photo-1542736667-069246bdbc7b?auto=format&fit=crop&w=800&q=80",
    summary:
      "Các biện pháp phòng ngừa hiệu quả để bảo vệ sức khỏe tình dục của bạn.",
    link: "#",
  },
  {
    title: "Benefits of hormone therapy",
    date: "Nov 10, 2021",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    summary:
      "Tìm hiểu những lợi ích sức khỏe và tinh thần khi sử dụng liệu pháp hormone.",
    link: "#",
  },
];

export default function BlogList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {blogPosts.map((post, index) => (
        <BlogCard key={index} {...post} />
      ))}
    </div>
  );
}

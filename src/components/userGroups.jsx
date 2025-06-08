import React from "react";
import { Link } from "react-router-dom";

const userGroups = [
  {
    title: "Nam giới",
    description: "Chăm sóc sức khỏe và phong độ phái mạnh.",
    icon: "👨",
    slug: "nam-gioi",
  },
  {
    title: "Nữ giới",
    description: "Bảo vệ sức khỏe giới tính, an tâm mỗi ngày.",
    icon: "👩",
    slug: "nu-gioi",
  },
  {
    title: "Mẹ bầu",
    description: "Đồng hành cùng mẹ từ thai kỳ đến ngày sinh nở.",
    icon: "🤰",
    slug: "me-bau",
  },
  {
    title: "Trẻ em",
    description: "Phát triển toàn diện cho trẻ nhỏ và vị thành niên.",
    icon: "🧒",
    slug: "tre-em",
  },
  {
    title: "Người già",
    description: "Nâng cao chất lượng sống cho người lớn tuổi.",
    icon: "🧓",
    slug: "nguoi-gia",
  },
];

export default function UserGroups() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {userGroups.map(({ title, description, icon, slug }) => (
          <Link
            key={title}
            to={`/groups/${slug}`}
            className="bg-white rounded-2xl shadow-md p-7 flex flex-col items-center text-center hover:shadow-xl hover:border-pink-300 border border-transparent transition-all group min-h-[230px] no-underline"
            style={{ textDecoration: "none" }} // Loại bỏ gạch chân
          >
            <div className="text-5xl mb-3">{icon}</div>
            <h3 className="text-base font-semibold mb-1">{title}</h3>
            <p className="text-gray-600 text-[14px] mb-3">{description}</p>
            <span className="inline-block mt-auto bg-pink-100 text-pink-700 px-4 py-1 rounded-full font-medium text-sm transition-all hover:bg-pink-200">
              Khám phá
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

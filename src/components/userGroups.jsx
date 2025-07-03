import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Heart, Star } from 'lucide-react';

const userGroups = [
  {
    title: "Nam giới",
    description: "Chăm sóc sức khỏe và phong độ phái mạnh.",
    icon: "👨",
    slug: "nam-gioi",
    color: "from-blue-400 to-cyan-400",
  },
  {
    title: "Nữ giới",
    description: "Bảo vệ sức khỏe giới tính, an tâm mỗi ngày.",
    icon: "👩",
    slug: "nu-gioi",
    color: "from-pink-400 to-rose-400",
  },
  {
    title: "Mẹ bầu",
    description: "Đồng hành cùng mẹ từ thai kỳ đến ngày sinh nở.",
    icon: "🤰",
    slug: "me-bau",
    color: "from-purple-400 to-indigo-400",
  },
  {
    title: "Trẻ em",
    description: "Phát triển toàn diện cho trẻ nhỏ và vị thành niên.",
    icon: "🧒",
    slug: "tre-em",
    color: "from-green-400 to-emerald-400",
  },
  {
    title: "Người già",
    description: "Nâng cao chất lượng sống cho người lớn tuổi.",
    icon: "🧓",
    slug: "nguoi-gia",
    color: "from-orange-400 to-red-400",
  },
];

export default function UserGroups() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {userGroups.map(({ title, description, icon, slug, color, participants }) => (
          <Link
            key={title}
            to={`/groups/${slug}`}
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-500 hover:-translate-y-3 min-h-[280px] no-underline"
            style={{ textDecoration: "none" }}
          >
            {/* Icon with gradient background */}
            <div className={`w-20 h-20 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              {icon}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-[#1C0C11] mb-3 group-hover:text-pink-600 transition-colors">
              {title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
              {description}
            </p>
            
            
            {/* Rating stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">4.9</span>
            </div>
            
            {/* CTA Button */}
            <div className={`group-hover:bg-gradient-to-r ${color} bg-pink-100 text-pink-700 group-hover:text-white px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 group-hover:scale-105 shadow-md group-hover:shadow-lg`}>
              <Heart className="w-4 h-4" />
              <span>Khám phá</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
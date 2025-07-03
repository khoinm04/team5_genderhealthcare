import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, Heart, CheckCircle } from 'lucide-react';
import userGroupDetails from "../data/userGroupDetails";
import Header from "./Header";
import Footer from "./Footer";

export default function UserGroupDetail() {
  const { groupSlug } = useParams();
  const group = userGroupDetails[groupSlug];

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Header />
        <div className="max-w-xl mx-auto py-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy nhóm</h2>
            <p className="text-gray-600 mb-6">Nhóm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              {group.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1C0C11] mb-2">{group.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Chăm sóc chuyên biệt</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>Đội ngũ chuyên gia</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
            <p className="text-gray-700 leading-relaxed text-lg">{group.overview}</p>
          </div>
        </div>

        {/* Age Groups Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C0C11]">Các giai đoạn/độ tuổi & vấn đề thường gặp</h2>
          </div>
          
          <div className="space-y-6">
            {group.ageGroups.map(({ range, issues, services, notes }, idx) => (
              <div key={idx} className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-pink-700 mb-3">{range}</h3>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Vấn đề thường gặp:</h4>
                      <ul className="space-y-1">
                        {issues.map((issue, j) => (
                          <li key={j} className="flex items-start gap-2 text-gray-700">
                            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Dịch vụ nổi bật:</h4>
                      <div className="flex flex-wrap gap-2">
                        {services.map((service, k) => (
                          <span key={k} className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                      <p className="text-yellow-800 text-sm italic">{notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C0C11]">Lời khuyên chăm sóc</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
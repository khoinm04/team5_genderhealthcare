import React from "react";
import { useParams, Link } from "react-router-dom";
import userGroupDetails from "../data/userGroupDetails";

export default function UserGroupDetail() {
  const { groupSlug } = useParams();
  const group = userGroupDetails[groupSlug];

  if (!group) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p>Không tìm thấy nhóm này.</p>
        <Link to="/" className="text-blue-500 hover:underline">Quay về trang chủ</Link>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{group.icon}</span>
        <h1 className="text-2xl font-bold">{group.title}</h1>
      </div>
      <p className="mb-6 text-gray-700">{group.overview}</p>

      <h2 className="font-semibold text-lg mb-2">Các giai đoạn/độ tuổi & vấn đề thường gặp</h2>
      {group.ageGroups.map(({ range, issues, services, notes }, idx) => (
        <div key={idx} className="mb-6 border-b pb-4">
          <h3 className="font-bold text-pink-700">{range}</h3>
          <ul className="ml-4 mb-1 list-disc text-gray-700">
            {issues.map((i, j) => (
              <li key={j}>{i}</li>
            ))}
          </ul>
          <div className="mb-1"><b>Dịch vụ nổi bật:</b> {services.join(", ")}</div>
          <div className="italic text-gray-600">{notes}</div>
        </div>
      ))}

      <h2 className="font-semibold text-lg mb-2 mt-6">Lời khuyên chăm sóc</h2>
      <ul className="list-disc ml-6 text-gray-700">
        {group.tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Link
          to="/booking"
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Đặt lịch tư vấn
        </Link>
      </div>
    </section>
  );
}

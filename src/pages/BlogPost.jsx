import React from "react";
import { useParams } from "react-router-dom";
import blogData from "../data/blogData"; // <-- Import từ file dữ liệu riêng

export default function BlogPost() {
  const { slug } = useParams();
  const blog = blogData[slug];

  if (!blog) {
    return <div className="max-w-2xl mx-auto py-10">Bài viết không tồn tại.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-lg text-gray-600 italic mb-4">{blog.subtitle}</div>
      <p className="text-gray-500 mb-4">{blog.date}</p>

      {/* Bỏ thẻ img hiển thị ảnh chính ở đây */}

      <div className="text-lg text-gray-800 space-y-6">
        {blog.content.map((section, idx) => {
          switch (section.type) {
            case "heading":
              return (
                <h2 key={idx} className="text-2xl font-semibold mt-6 mb-2">
                  {section.text}
                </h2>
              );
            case "paragraph":
              return <p key={idx}>{section.text}</p>;
            case "image":
              // Bỏ render các khối kiểu ảnh trong content
              return null;
            case "list":
              return (
                <ul key={idx} className="list-disc list-inside pl-4">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
            case "quote":
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-blue-400 pl-4 italic text-blue-900 bg-blue-50 py-2"
                >
                  {section.text}
                </blockquote>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

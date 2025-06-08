import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ title, date, image, summary, link }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
    <img
      src={image}
      alt={title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{date}</p>
      <p className="text-gray-600 mt-2">{summary}</p>
      <Link
        to={link}
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        Đọc thêm
      </Link>
    </div>
  </div>
);

export default BlogCard;

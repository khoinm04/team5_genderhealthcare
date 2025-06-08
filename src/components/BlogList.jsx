import React from "react";
import BlogCard from "./BlogCard";

const BlogList = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return <div className="text-center py-10">Không có bài viết nào.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {blogs.map((post, index) => (
        <BlogCard
          key={index}
          {...post}
        />
      ))}
    </div>
  );
};

export default BlogList;

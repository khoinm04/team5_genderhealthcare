import React from "react";
import Header from "../Header";
import BlogList from "./BlogList";
import Footer from "../Footer";

export default function BlogPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="self-stretch bg-gray-100 min-h-screen">
        <Header />
        <section className="max-w-[960px] mx-auto px-4 py-10">
          <h2 className="text-[#1C0C11] text-3xl font-bold mb-6">Blog</h2>
          <BlogList />
        </section>
      </div>
      <Footer />
    </div>
  );
}

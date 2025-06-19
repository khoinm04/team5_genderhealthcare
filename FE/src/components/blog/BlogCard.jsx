import React from "react";

export default function BlogCard({ title, date, image, summary, link, horizontal }) {
  return (
    <article
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex ${
        horizontal ? "flex-row" : "flex-col"
      }`}
      onClick={() => window.open(link, "_blank")}
      tabIndex={0}
      role="link"
      onKeyDown={(e) => {
        if (e.key === "Enter") window.open(link, "_blank");
      }}
    >
      <img
        src={image}
        alt={title}
        className={`object-cover ${horizontal ? "w-1/3 h-auto" : "w-full h-48"}`}
        loading="lazy"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-[#1C0C11]">{title}</h3>
        <p className="text-sm text-[#964F66] mb-3">{date}</p>
        <p className="text-gray-700 flex-grow">{summary}</p>
        <button
          className="mt-4 self-start bg-[#E5195B] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c4124a] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            window.open(link, "_blank");
          }}
        >
          Xem chi tiết
        </button>
      </div>
    </article>
  );
}

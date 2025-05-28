import React from "react"

export default function BlogCard({ image, title, date }) {
  return (
    <div className="flex flex-1 flex-col pb-3 gap-3">
      <img src={image} alt={title} className="self-stretch h-[258px] object-fill" />
      <div className="flex flex-col items-start self-stretch">
        <span className="text-[#1C0C11] text-base font-bold mb-[1px]">{title}</span>
        <span className="text-[#964F66] text-sm mb-[1px]">{date}</span>
      </div>
    </div>
  )
}

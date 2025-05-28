import React from "react"

export default function ServiceCard({ title, description, icon }) {
  return (
    <div className="flex flex-1 flex-col items-start bg-[#FCF7F9] py-[17px] gap-3 rounded-lg border border-solid border-[#E8D1D6]">
      <img src={icon} alt={`${title} icon`} className="w-6 h-6 mx-[17px] object-fill" />
      <div className="flex flex-col items-start self-stretch mx-[17px]">
        <span className="text-[#1C0C11] text-base font-bold mb-[5px]">{title}</span>
        <span className="text-[#964F66] text-sm mb-[1px]">{description}</span>
      </div>
    </div>
  )
}

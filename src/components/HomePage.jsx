import React from "react"
import Header from "./Header"
import Services from "./Services"
import BlogList from "./BlogList"

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#FCF7F9] h-[1407px]">
        <Header />

        <div className="flex flex-col items-center self-stretch py-5">
          <div className="flex flex-col items-start w-[960px]">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/pphwh3dr_expires_30_days.png"
              className="self-stretch h-[512px] object-fill"
              alt="Main Banner"
            />

            <div className="flex flex-col self-stretch py-10 gap-10">
              <div className="flex flex-col items-start self-stretch mx-4">
                <span className="text-[#1C0C11] text-4xl font-bold mb-[17px]">Services</span>
                <span className="text-[#1C0C11] text-base mb-[1px]">
                  From hormone therapy to mental health support, we make it easy to get the care you
                  need.
                </span>
              </div>
              <Services />
            </div>

            <span className="text-[#1C0C11] text-[22px] font-bold my-5 ml-4">Latest from our blog</span>
            <BlogList />
          </div>
        </div>
      </div>
    </div>
  )
}

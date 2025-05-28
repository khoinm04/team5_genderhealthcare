import React from "react"
import BlogCard from "./BlogCard"

const blogPosts = [
  {
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/xg7wbw1n_expires_30_days.png",
    title: "Navigating the world of gender affirming care",
    date: "Apr 12, 2022",
  },
  {
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mbASLNLBhc/tnhixw7a_expires_30_days.png",
    title: "What to expect when starting hormone therapy",
    date: "Mar 30, 2022",
  },
]

export default function BlogList() {
  return (
    <div className="flex items-start self-stretch p-4 gap-3">
      {blogPosts.map(({ image, title, date }) => (
        <BlogCard key={title} image={image} title={title} date={date} />
      ))}
    </div>
  )
}

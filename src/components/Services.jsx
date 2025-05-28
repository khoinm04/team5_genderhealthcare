import React from "react"
import ServiceCard from "./ServiceCard"

const servicesData = [
  {
    title: "Hormone Therapy",
    description: "Get personalized hormone therapy, with medication delivered to your door.",
    icon: "https://i.imgur.com/1tMFzp8.png",
  },
  {
    title: "Mental Health Support",
    description: "Connect with a licensed therapist for support with mental health, relationships, and more.",
    icon: "https://i.imgur.com/1tMFzp8.png",
  },
  {
    title: "Primary Care",
    description: "See a primary care provider for everything from checkups to colds.",
    icon: "https://i.imgur.com/1tMFzp8.png",
  },
]

export default function Services() {
  return (
    <div className="flex items-start self-stretch mx-4 gap-3">
      {servicesData.map(({ title, description, icon }) => (
        <ServiceCard key={title} title={title} description={description} icon={icon} />
      ))}
    </div>
  )
}

import React from "react";

const userGroups = [
  {
    title: "Nam giới",
    description: "Dịch vụ chăm sóc sức khỏe giới tính cho nam giới.",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Nữ giới",
    description: "Dịch vụ chăm sóc sức khỏe giới tính cho nữ giới.",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Mẹ bầu",
    description: "Hỗ trợ chăm sóc sức khỏe cho phụ nữ mang thai.",
    image:
      "https://images.unsplash.com/photo-1606795157712-4e2aee2d0e6a?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Trẻ em",
    description: "Chăm sóc sức khỏe giới tính và phát triển cho trẻ em.",
    image:
      "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Người già",
    description: "Dịch vụ chăm sóc sức khỏe giới tính cho người cao tuổi.",
    image:
      "https://images.unsplash.com/photo-1532634726-4d9ec9e8b88b?auto=format&fit=crop&w=400&q=80",
  },
];


export default function UserGroups() {
  return (
    <section className="max-w-[960px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {userGroups.map(({ title, description, image }) => (
          <div
            key={title}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-40 object-cover rounded-md mb-4"
              loading="lazy"
            />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

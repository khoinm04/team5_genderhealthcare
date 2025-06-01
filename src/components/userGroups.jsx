import React from "react";

const userGroups = [
  {
    title: "Nam giới",
    description: "Dịch vụ chăm sóc sức khỏe giới tính cho nam giới.",
    image:
      "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.s2E6lmMu3dWhkFUsBtgebwHaJX%26pid%3DApi&sp=1748698501Td9a7e7f051304ccf83c5e8fdc5df26f1af20e46b4f4e082a6a8b40259dcb04c1", // ảnh thực tế nam giới
  },
  {
    title: "Nữ giới",
    description: "Dịch vụ chăm sóc sức khỏe giới tính cho nữ giới.",
    image:
      "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.explicit.bing.net%2Fth%2Fid%2FOIP.I0XOTspHQYIjaw-7EU_ZngHaKi%3Fpid%3DApi&sp=1748698547T768395557ea8c1ca0b92f6ea3985ff03626b578107f09c0769c0aaeabb70bc71", // ảnh thực tế nữ giới
  },
  {
    title: "Mẹ bầu",
    description: "Hỗ trợ chăm sóc sức khỏe cho phụ nữ mang thai.",
    image:
      "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.308x2GzZZstFq1tSXUvLRAHaLH%26pid%3DApi&sp=1748698580T2c1df9838025c5b501fb3146d67ff0129ec371738845839165d7d518c2f3ee43", // ảnh mẹ bầu
  },
  {
    title: "Trẻ em",
    description: "Chăm sóc sức khỏe giới tính và phát triển cho trẻ em.",
    image:
      "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%3Fid%3DOIP._3djIRVxnh0casqh1UdFqQHaE-%26pid%3DApi&sp=1748698654T266fcb118ab5d81e3de3671514e7bcbdfaf73bfd408582f239ad65447ce1c89c", // ảnh trẻ em
  },
  {
    title: "Người già",
    description: "Dịch vụ chăm sóc sức khỏe giới tính cho người cao tuổi.",
    image:
      "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Xl-eFl3lxQ_M5jPyKJkZAgHaDt%26pid%3DApi&sp=1748698733T7ae07d43cded44b1aac39142d2eecceb0ec72fe51e7636ad2f5728a1cdeab0d7", // ảnh người già
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

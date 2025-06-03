import React, { useState } from "react";
import axios from "axios";

function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/register", formData);
      setMessage({ text: "Đăng ký thành công!", type: "success" });
      setFormData({ name: "", email: "", password: "", phone: "" });
    } catch (err) {
      setMessage({ text: "Đăng ký thất bại. Email có thể đã được sử dụng.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#8C66D9]">Đăng ký</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Họ và tên"
          type="text"
          name="name"
          placeholder="Nhập họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Mật khẩu"
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <InputField
          label="Số điện thoại"
          type="tel"
          name="phone"
          placeholder="Nhập số điện thoại (0xxxxxxxxx)"
          value={formData.phone}
          onChange={handleChange}
          pattern="^0\d{9}$"
          title="Số điện thoại bắt đầu bằng 0, gồm 10 số"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-colors duration-300
            ${loading ? "bg-purple-300 cursor-not-allowed" : "bg-[#8C66D9] hover:bg-[#734fc9]"}`}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {message.text && (
          <p
            className={`mt-4 text-center text-sm ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}

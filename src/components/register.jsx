import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoen: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/register", formData);
      setMessage("Đăng ký thành công!");
    } catch (err) {
      setMessage("Đăng ký thất bại. Email có thể đã được sử dụng.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Đăng ký</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        <input
        type="tel"
        name="phone"
        placeholder="Số điện thoại"
        pattern="^0\d{9}$"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
        required
        />
        <button
          type="submit"
          className="w-full bg-[#8C66D9] text-white py-2 rounded-lg font-bold hover:bg-[#734fc9]"
        >
          Đăng ký
        </button>
        {message && <p className="text-center mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}

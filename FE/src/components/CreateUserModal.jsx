import React, { useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [userFilter, setUserFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    role: "Khách hàng"
  });

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/admin/create-user", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Tạo tài khoản thành công");
      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tạo tài khoản");
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal tạo tài khoản */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg space-y-4">
            <h3 className="text-xl font-bold mb-2">Tạo tài khoản</h3>

            <input name="fullName" placeholder="Họ tên" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="password" type="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="age" type="number" placeholder="Tuổi" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" />

            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="Khách hàng">Khách hàng</option>
              <option value="Tư vấn viên">Tư vấn viên</option>
              <option value="Nhân viên">Nhân viên</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Quản trị viên">Quản trị viên</option>
            </select>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={handleCloseCreateModal} className="px-4 py-2 bg-gray-300 rounded-lg">Hủy</button>
              <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Tạo</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <div className="flex space-x-4">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Khách hàng">Khách hàng</option>
            <option value="Tư vấn viên">Tư vấn viên</option>
            <option value="Nhân viên">Nhân viên</option>
            <option value="Quản trị viên">Quản trị viên</option>
            <option value="Quản lý">Quản lý</option>
          </select>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Tạo tài khoản
          </button>
        </div>
      </div>

      {/* ... danh sách người dùng sau này ... */}
    </div>
  );
};

export default UserManagement;

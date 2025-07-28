import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, Calendar, MoreVertical, Filter } from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredStaff = staff.filter(member => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      String(member.active) === filterStatus;

    return matchesSearch && matchesFilter;
  });


  const openModal = (type, staffMember) => {
    setModalType(type);
    setSelectedStaff(staffMember || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStaff(null);
  };

  const handleSaveStaff = async (formData) => {
    console.log("🔍 Kiểm tra formData:", formData);

    if (modalType === 'add') {
      const newStaff = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
      };
      setStaff([...staff, newStaff]);
    } else if (modalType === 'edit') {
      try {
        console.log("🚀 specialization gửi lên:", formData.specialization);

        const response = await fetch('/api/manager/staffs/full', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            staffId: selectedStaff.id,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            specialization: formData.specialization,
            hireDate: formData.hireDate,
          }),
        });

        const result = await response.text(); // 👈 đọc nội dung lỗi trả về từ server
        if (!response.ok) {
          console.error("❌ Cập nhật thất bại:", response.status, result);
          throw new Error('Cập nhật thất bại');
        }

        // ✅ Hiển thị thông báo thành công
        alert('Cập nhật thành công');

        // ✅ Nếu cập nhật thành công, cập nhật local state
        setStaff(prev =>
          prev.map((member) =>
            member.id === selectedStaff.id
              ? {
                ...member,
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                specialization: formData.specialization,
                hireDate: formData.hireDate,
              }
              : member
          )
        );
      } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error);
        alert('Cập nhật thông tin thất bại');
      }

    }
  };



  const getStatusBadge = (active) => {
    const isActive = Boolean(active); // ép kiểu an toàn
    const colorClass = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    const text = isActive ? "Hoạt động" : "Không hoạt động";

    return (
      <span className={`px-2 py-1 text-xs font-medium ${colorClass} rounded-full`}>
        {text}
      </span>
    );
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`/api/manager/staffs?page=${page}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Lỗi khi tải danh sách nhân viên');
        const data = await response.json();
        setStaff(data.content);       // danh sách nhân viên
        setTotalPages(data.totalPages); // tổng số trang
      } catch (error) {
        console.error(error);
        alert('Không thể tải danh sách nhân viên');
      }
    };

    fetchStaff();
  }, [page, size]);





  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và lịch làm việc của nhân viên</p>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>

          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nhân viên</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Vị trí</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Chuyên môn</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trạng thái</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ngày bắt đầu</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {member.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 h-1">{member.fullName}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{member.roleDisplay}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium inline-block">
                      {member.specialization || 'Chưa xác định'}
                    </span>
                  </td>


                  <td className="py-4 px-4">{getStatusBadge(member.active)}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {new Date(member.hireDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openModal('view', member)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal('edit', member)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Xem lịch"
                      >
                        <Calendar size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Thêm tùy chọn"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ◀ Trước
        </button>

        <span className="text-sm text-gray-700">
          Trang {page + 1} / {totalPages}
        </span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Sau ▶
        </button>

        <select
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0); // reset lại về trang đầu nếu đổi size
          }}
          className="ml-4 px-2 py-1 border rounded"
        >
          <option value={6}>6 nhân viên/trang</option>
          <option value={9}>9 nhân viên/trang</option>
          <option value={12}>12 nhân viên/trang</option>
        </select>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'add' ? 'Thêm nhân viên mới' :
                  modalType === 'edit' ? 'Chỉnh sửa nhân viên' : 'Chi tiết nhân viên'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {modalType === 'view' && selectedStaff && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vị trí</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStaff.roleDisplay}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                    <p className="mt-1 text-sm text-gray-900">{translateSpecialty(selectedStaff.specialization) || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedStaff.hireDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
              {(modalType === 'edit' || modalType === 'add') && (
                <StaffForm
                  staff={selectedStaff}
                  onSave={handleSaveStaff}
                  onCancel={closeModal}
                />
              )}
            </div>
            {modalType === 'view' && (
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Staff Form Component
const StaffForm = ({ staff, onSave, onCancel }) => {
  const [testServiceOptions, setTestServiceOptions] = useState([]);

  const [formData, setFormData] = useState({
  name: staff?.fullName || '',
  email: staff?.email || '',
  phoneNumber: staff?.phoneNumber || '',
  specialization: staff?.specialization || '',
  specializationId: '', // thêm trường này
  hireDate: staff?.hireDate || new Date().toISOString().split('T')[0]
});

useEffect(() => {
  if (staff && testServiceOptions.length > 0) {
    const matched = testServiceOptions.find(
      (opt) => opt.name === staff.specialization
    );

    setFormData(prev => ({
      ...prev,
      specializationId: matched?.id || '',
    }));
  }
}, [staff, testServiceOptions]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔍 formData check:", formData);
    // Basic validation
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.specialization || !formData.hireDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Vui lòng nhập email hợp lệ');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10-11 số)');
      return;
    }

    // Start date validation
    const startDate = new Date(formData.hireDate);
    const today = new Date();
    if (startDate > today) {
      if (!confirm('Ngày bắt đầu là trong tương lai. Bạn có chắc chắn muốn tiếp tục?')) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Có lỗi xảy ra khi lưu thông tin nhân viên');
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/manager/test", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTestServiceOptions(data); // [{ id, name, category }]
      })
      .catch(err => console.error("❌ Không thể load dịch vụ xét nghiệm:", err));
  }, []);


  const handleCancel = () => {
    if (JSON.stringify(formData) !== JSON.stringify({
      name: staff?.name || '',
      email: staff?.email || '',
      phoneNumber: staff?.phoneNumber || '',
      specialization: staff?.specialization || '',
      hireDate: staff?.hireDate || new Date().toISOString().split('T')[0]
    })) {
      if (confirm('Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn hủy?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Họ tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nhập họ tên"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500"></span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Nhập email"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nhập số điện thoại"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Chuyên môn <span className="text-red-500">*</span>
        </label>
        <select
  value={formData.specializationId || ''}
  onChange={(e) => {
    const selected = testServiceOptions.find(s => s.id === parseInt(e.target.value));
    setFormData({
      ...formData,
      specializationId: selected?.id,
      specialization: selected?.name || ''
    });
  }}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"

>
  <option value="">Chọn chuyên môn</option>
  {testServiceOptions.map(opt => (
    <option key={opt.id} value={opt.id}>
      {opt.name}
    </option>
  ))}
</select>



      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ngày bắt đầu <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.hireDate}
          onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </>
          ) : (
            <>
              {staff ? 'Cập nhật' : 'Thêm'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StaffManagement;
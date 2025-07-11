import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, Calendar, Star, MoreVertical, Filter } from 'lucide-react';

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredConsultants = consultants.filter(member => {
  const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        member.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter =
    filterStatus === 'all' ||
    String(member.active) === filterStatus; // vì active là boolean, filterStatus là string

  return matchesSearch && matchesFilter;
});


  const openModal = (type, consultant) => {
    setModalType(type);
    setSelectedConsultant(consultant || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedConsultant(null);
  };

  const handleSaveConsultant = async (formData) => {
    console.log("🔍 Kiểm tra formData:", formData);

    if (modalType === 'add') {
      const newConsultant = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
      };
      setConsultants([...consultants, newConsultant]);
    } else if (modalType === 'edit') {
      try {
        console.log("🚀 specialization gửi lên:", formData.specialization);

        const response = await fetch('/api/manager/consultants/full', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            consultantId: selectedConsultant.id,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            specialization: formData.specialization,
            hireDate: formData.hireDate,
            yearsOfExperience: formData.yearsOfExperience, // 🆕 Thêm năm kinh nghiệm
          }),
        });

        const result = await response.text();
        if (!response.ok) {
          console.error("❌ Cập nhật thất bại:", response.status, result);
          throw new Error('Cập nhật thất bại');
        }

        alert('Cập nhật thành công');

        // ✅ Cập nhật local state
        setConsultants(prev =>
          prev.map((member) =>
            member.id === selectedConsultant.id
              ? {
                ...member,
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                specialization: formData.specialization,
                hireDate: formData.hireDate,
                yearsOfExperience: formData.yearsOfExperience,
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

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">({rating})</span>
      </div>
    );
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/manager/consultants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Lỗi khi tải danh sách nhân viên');
        const data = await response.json();
        setConsultants(data);
      } catch (error) {
        console.error(error);
        alert('Không thể tải danh sách nhân viên');
      }
    };

    fetchStaff();
  }, []);

  const translateSpecialty = (specialization) => {
    switch (specialization) {
      case 'GENERAL_CONSULTATION':
        return 'Tư vấn tổng quát';
      case 'SPECIALIST_CONSULTATION':
        return 'Tư vấn chuyên khoa';
      case 'RE_EXAMINATION':
        return 'Tư vấn tái khám';
      case 'EMERGENCY_CONSULTATION':
        return 'Tư vấn y tế khẩn cấp';
      default:
        return specialization;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tư vấn viên</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và lịch tư vấn của các chuyên gia</p>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc chuyên môn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultants Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tư vấn viên</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Vị trí</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Chuyên môn</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Kinh nghiệm</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trạng thái</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ngày bắt đầu</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Chứng chỉ</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConsultants.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium">
                          {consultant.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 h-1">{consultant.fullName}</p>
                        <p className="text-sm text-gray-500">{consultant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{consultant.roleDisplay}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium inline-block">
                      {translateSpecialty(consultant.specialization) || 'Chưa xác định'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{consultant.yearsOfExperience} năm</td>
                  <td className="py-4 px-4">{getStatusBadge(consultant.active)}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {new Date(consultant.hireDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {consultant.certificates && consultant.certificates.length > 0 ? (
                      consultant.certificates.map((cert, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium inline-block mr-1 mb-1"
                        >
                          {cert}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">Chưa có chứng chỉ</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openModal('view', consultant)}
                        className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal('edit', consultant)}
                        className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'add' ? 'Thêm tư vấn viên mới' :
                  modalType === 'edit' ? 'Chỉnh sửa tư vấn viên' : 'Chi tiết tư vấn viên'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {modalType === 'view' && selectedConsultant && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                    <p className="mt-1 text-sm text-gray-900">{translateSpecialty(selectedConsultant.specialization) || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.yearsOfExperience} năm</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedConsultant.hireDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                </div>
              )}
              {(modalType === 'edit' || modalType === 'add') && (
                <ConsultantForm
                  consultant={selectedConsultant}
                  onSave={handleSaveConsultant}
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

// Consultant Form Component
const ConsultantForm = ({ consultant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: consultant?.fullName || consultant?.name || '',
    email: consultant?.email || '',
    phoneNumber: consultant?.phoneNumber || '',
    specialization: consultant?.specialization || '',
    yearsOfExperience: consultant?.yearsOfExperience || '',
    hireDate: consultant?.hireDate || new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔍 formData check:", formData);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.specialization || !formData.yearsOfExperience || !formData.hireDate) {
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

    // Experience validation
    if (formData.experience < 0 || formData.yearsOfExperience > 50) {
      alert('Kinh nghiệm phải từ 0 đến 50 năm');
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
      console.error('Error saving consultant:', error);
      alert('Có lỗi xảy ra khi lưu thông tin tư vấn viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (JSON.stringify(formData) !== JSON.stringify({
      name: consultant?.name || '',
      email: consultant?.email || '',
      phoneNumber: consultant?.phoneNumber || '',
      specialization: consultant?.specialization || '',
      yearsOfExperience: consultant?.yearsOfExperience || '',
      hireDate: consultant?.hireDate || new Date().toISOString().split('T')[0]
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
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Nhập họ tên"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          disabled
          value={formData.email}
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
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Nhập số điện thoại"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Chuyên môn <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        >
          <option value="">Chọn chuyên môn</option>
          <option value="GENERAL_CONSULTATION">Tư vấn tổng quát</option>
          <option value="SPECIALIST_CONSULTATION">Tư vấn chuyên khoa</option>
          <option value="RE_EXAMINATION">Tư vấn tái khám</option>
          <option value="EMERGENCY_CONSULTATION">Tư vấn khẩn cấp</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kinh nghiệm (năm) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.yearsOfExperience}
          onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || '' })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Nhập số năm kinh nghiệm"
          min="0"
          max="50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ngày bắt đầu <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.hireDate}
          onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </>
          ) : (
            <>
              {consultant ? 'Cập nhật' : 'Thêm'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ConsultantManagement;
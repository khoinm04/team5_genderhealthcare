import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, Trash2, Filter } from 'lucide-react';
import axios from 'axios';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = [
    { value: 'GENERAL_CONSULTATION', label: 'Tư vấn tổng quát' },
    { value: 'SPECIALIST_CONSULTATION', label: 'Tư vấn chuyên khoa' },
    { value: 'RE_EXAMINATION', label: 'Tư vấn tái khám' },
    { value: 'EMERGENCY_CONSULTATION', label: 'Tư vấn y tế khẩn cấp' },
    { value: 'STI_HIV', label: 'Xét nghiệm HIV' },
    { value: 'STI_Syphilis', label: 'Xét nghiệm Giang mai' },
    { value: 'STI_Gonorrhea', label: 'Xét nghiệm Lậu' },
    { value: 'STI_Chlamydia', label: 'Xét nghiệm Chlamydia' },
  ];

  const getCategoryLabel = (value) => {
    const found = categories.find(cat => cat.value === value);
    return found ? found.label : value;
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openModal = (type, service) => {
    setModalType(type);

    if (type === 'edit' || type === 'view') {
      const cleanedDuration = String(service.duration).replace(/\D/g, '');
      setSelectedService({ ...service, duration: cleanedDuration });
    } else {
      setSelectedService(service);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleDeleteService = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      closeModal();
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Đang hoạt động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        Tạm dừng
      </span>
    );
  };




  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };


  useEffect(() => {
    fetch("http://localhost:8080/api/manager/services/manager", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Lỗi khi tải danh sách dịch vụ:", err));
  }, []);

  const translateCategory = (category) => {
    switch (category) {
      case 'GENERAL_CONSULTATION':
        return 'Tư vấn tổng quát';
      case 'SPECIALIST_CONSULTATION':
        return 'Tư vấn chuyên khoa';
      case 'RE_EXAMINATION':
        return 'Tư vấn tái khám';
      case 'EMERGENCY_CONSULTATION':
        return 'Tư vấn y tế khẩn cấp';
      case 'STI_HIV':
        return 'Xét nghiệm HIV';
      case 'STI_Syphilis':
        return 'Xét nghiệm Giang mai';
      case 'STI_Gonorrhea':
        return 'Xét nghiệm Lậu';
      case 'STI_Chlamydia':
        return 'Xét nghiệm Chlamydia';
      default:
        return category;
    }
  };

  const translateCategoryType = (type) => {
    switch (type) {
      case 'TEST':
        return 'Xét nghiệm';
      case 'CONSULTATION':
        return 'Tư vấn';
      default:
        return 'Không xác định';
    }
  };


  const handleSaveService = () => {
    if (!selectedService) return;

    const body = {
      serviceName: selectedService.serviceName,
      description: selectedService.description,
      price: parseFloat(selectedService.price),
      duration: parseInt(selectedService.duration, 10),
      category: selectedService.category,
      isActive: selectedService.isActive,
    };
    console.log("📦 Dữ liệu gửi lên backend:", body);

    fetch(`http://localhost:8080/api/manager/services/${selectedService.serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json(); // hoặc `res.text()` nếu backend không trả json
      })
      .then(() => {
        alert("✅ Cập nhật thành công!");
        setShowModal(false); // đóng modal

        // Tải lại danh sách dịch vụ sau khi cập nhật
        fetch("http://localhost:8080/api/manager/services", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then(res => res.json())
          .then(data => setServices(data));
      })
      .catch(err => {
        console.error("❌ Lỗi khi cập nhật dịch vụ:", err);
        alert("❌ Đã xảy ra lỗi khi cập nhật dịch vụ.");
      });
  };

  //api them dich vu
  const handleAddService = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      // Kiểm tra dữ liệu cần thiết
      if (!selectedService.serviceName || !selectedService.price || !selectedService.categoryType) {
        alert("Vui lòng nhập đầy đủ thông tin dịch vụ");
        return;
      }

      await axios.post("/api/manager/create", selectedService, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Thêm dịch vụ thành công");
      // fetchServices(); // gọi lại API để cập nhật danh sách
      closeModal();

    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error);
      alert("Thêm dịch vụ thất bại");
    }
  };



  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý dịch vụ</h1>
          <p className="text-gray-600 mt-1">Quản lý các dịch vụ tư vấn và xét nghiệm y tế</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Thêm dịch vụ
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}

              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.serviceId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{service.serviceName}</h3>
                <p className="text-sm text-gray-500">{translateCategory(service.category)}</p>
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => openModal('view', service)}
                  className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => openModal('edit', service)}
                  className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => openModal('delete', service)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Giá dịch vụ</p>
                  <p className="text-lg font-bold text-purple-600">{formatPrice(service.price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Thời gian</p>
                  <p className="text-sm text-gray-600">{service.duration} phút</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {getStatusBadge(service.isActive)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'add' ? 'Thêm dịch vụ mới' :
                  modalType === 'edit' ? 'Chỉnh sửa dịch vụ' :
                    modalType === 'delete' ? 'Xác nhận xóa' : 'Chi tiết dịch vụ'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {modalType === 'delete' && selectedService && (
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    Bạn có chắc chắn muốn xóa dịch vụ "{selectedService.serviceName}"?
                  </p>
                  <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
                </div>
              )}
              {modalType === 'view' && selectedService && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.serviceName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giá</label>
                      <p className="mt-1 text-sm text-gray-900">{formatPrice(selectedService.price)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thời gian</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedService.duration} phút</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                    <p className="mt-1 text-sm text-gray-900">  {translateCategoryType(selectedService.categoryType)}
                    </p>

                  </div>
                </div>
              )}
              {(modalType === 'edit' || modalType === 'add') && (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                    <input
                      type="text"
                      defaultValue={selectedService?.serviceName || ''}
                      onChange={(e) =>
                        setSelectedService(prev => ({ ...prev, serviceName: e.target.value }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                      defaultValue={selectedService?.description || ''}
                      rows={3}
                      onChange={(e) =>
                        setSelectedService(prev => ({ ...prev, description: e.target.value }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giá (VND)</label>
                      <input
                        type="number"
                        defaultValue={selectedService?.price || ''}
                        min="0"
                        onChange={(e) =>
                          setSelectedService(prev => ({ ...prev, price: e.target.value }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thời gian (phút)</label>
                      <input
                        type="number"
                        value={parseInt(selectedService?.duration) || ''}
                        min="15"
                        step="15"
                        onChange={(e) =>
                          setSelectedService(prev => ({
                            ...prev,
                            duration: e.target.value
                          }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />

                    </div>
                    
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                    <select
                      value={selectedService?.categoryType || ''}
                      onChange={(e) =>
                        setSelectedService(prev => ({ ...prev, categoryType: e.target.value }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="CONSULTATION">Tư vấn</option>
                      <option value="TEST">Xét nghiệm</option>
                    </select>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <select
                      defaultValue={selectedService?.isActive ? 'active' : 'inactive'}
                      onChange={(e) =>
                        setSelectedService(prev => ({
                          ...prev,
                          isActive: e.target.value === 'active',
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="true">Đang hoạt động</option>
                      <option value="false">Tạm dừng</option>
                    </select>
                  </div>
                </form>
              )}
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {modalType === 'delete' ? 'Hủy' : modalType === 'view' ? 'Đóng' : 'Hủy'}
              </button>
              {modalType === 'delete' && (
                <button
                  onClick={handleDeleteService}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              )}
              {modalType !== 'view' && modalType !== 'delete' && (
                <button
                  onClick={
                    modalType === 'edit'
                      ? handleSaveService
                      : modalType === 'add'
                        ? handleAddService
                        : closeModal
                  }
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {modalType === 'add' ? 'Thêm' : 'Lưu'}
                </button>

              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
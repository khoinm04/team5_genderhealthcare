import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Trash2, Filter } from 'lucide-react';
import { mockServices } from '../data/mockData';

const ServiceManagement = () => {
  const [services, setServices] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = ['Tài chính', 'Pháp lý', 'Marketing', 'Kinh doanh', 'Công nghệ', 'Y tế'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openModal = (type, service) => {
    setModalType(type);
    setSelectedService(service || null);
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

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Đang hoạt động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        Tạm dừng
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'Tài chính': 'bg-blue-100 text-blue-800',
      'Pháp lý': 'bg-green-100 text-green-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Kinh doanh': 'bg-orange-100 text-orange-800',
      'Công nghệ': 'bg-indigo-100 text-indigo-800',
      'Y tế': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
                  <option key={category} value={category}>{category}</option>
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
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{service.name}</h3>
                {getCategoryBadge(service.category)}
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
                {getStatusBadge(service.status)}
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
                    Bạn có chắc chắn muốn xóa dịch vụ "{selectedService.name}"?
                  </p>
                  <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
                </div>
              )}
              {modalType === 'view' && selectedService && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedService.name}</p>
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
                    <p className="mt-1 text-sm text-gray-900">{selectedService.category}</p>
                  </div>
                </div>
              )}
              {(modalType === 'edit' || modalType === 'add') && (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                    <input
                      type="text"
                      defaultValue={selectedService?.name || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                      defaultValue={selectedService?.description || ''}
                      rows={3}
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
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thời gian (phút)</label>
                      <input
                        type="number"
                        defaultValue={selectedService?.duration || ''}
                        min="15"
                        step="15"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                    <select
                      defaultValue={selectedService?.category || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <select
                      defaultValue={selectedService?.status || 'active'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
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
                  onClick={closeModal}
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
import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Calendar, Star, MoreVertical } from 'lucide-react';
import { mockConsultants } from '../data/mockData';

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState(mockConsultants);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');

  const filteredConsultants = consultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, consultant) => {
    setModalType(type);
    setSelectedConsultant(consultant || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedConsultant(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: 'Sẵn sàng', class: 'bg-green-100 text-green-800' },
      busy: { label: 'Bận', class: 'bg-yellow-100 text-yellow-800' },
      offline: { label: 'Offline', class: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tư vấn viên</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và lịch tư vấn của các chuyên gia</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Thêm tư vấn viên
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc chuyên môn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map((consultant) => (
          <div key={consultant.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-medium text-lg">
                  {consultant.name.split(' ').pop()?.charAt(0)}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => openModal('view', consultant)}
                  className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => openModal('edit', consultant)}
                  className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                  title="Xem lịch"
                >
                  <Calendar size={16} />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Thêm tùy chọn"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{consultant.name}</h3>
                <p className="text-sm text-gray-600">{consultant.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Chuyên môn</p>
                <p className="text-sm text-gray-600">{consultant.specialization}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Kinh nghiệm</p>
                  <p className="text-sm text-gray-600">{consultant.experience} năm</p>
                </div>
                <div>
                  {getStatusBadge(consultant.status)}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Đánh giá</p>
                {renderStars(consultant.rating)}
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
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedConsultant.experience} năm</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                    <div className="mt-1">{renderStars(selectedConsultant.rating)}</div>
                  </div>
                </div>
              )}
              {(modalType === 'edit' || modalType === 'add') && (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <input
                      type="text"
                      defaultValue={selectedConsultant?.name || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue={selectedConsultant?.email || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="tel"
                      defaultValue={selectedConsultant?.phone || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                    <select
                      defaultValue={selectedConsultant?.specialization || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Chọn chuyên môn</option>
                      <option value="Tư vấn tài chính">Tư vấn tài chính</option>
                      <option value="Tư vấn pháp lý">Tư vấn pháp lý</option>
                      <option value="Tư vấn kinh doanh">Tư vấn kinh doanh</option>
                      <option value="Tư vấn marketing">Tư vấn marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kinh nghiệm (năm)</label>
                    <input
                      type="number"
                      defaultValue={selectedConsultant?.experience || ''}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {modalType === 'view' ? 'Đóng' : 'Hủy'}
              </button>
              {modalType !== 'view' && (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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

export default ConsultantManagement;
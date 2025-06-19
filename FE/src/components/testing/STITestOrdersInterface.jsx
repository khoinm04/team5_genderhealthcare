import React, { useState } from 'react';
import { Plus, Edit, List, Eye, Send, Search, Calendar, User } from 'lucide-react';

const STITestOrdersInterface = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Nguyễn Văn Anh', phone: '0123-456-789', email: 'anh.nguyen@email.com' },
    { id: 2, name: 'Trần Thị Bình', phone: '0987-654-321', email: 'binh.tran@email.com' },
    { id: 3, name: 'Lê Minh Cường', phone: '0555-123-456', email: 'cuong.le@email.com' }
  ]);
  const [testOrders, setTestOrders] = useState([
    { 
      id: 1, 
      customerId: 1, 
      customerName: 'Nguyễn Hoài Ân',
      testType: 'Gói xét nghiệm STI toàn diện', 
      status: 'Đã lấy mẫu', 
      orderDate: '2025-06-01',
      expectedResults: '2025-06-05'
    },
    { 
      id: 2, 
      customerId: 2, 
      customerName: 'Trần Thanh Nam',
      testType: 'Xét nghiệm Chlamydia/Gonorrhea', 
      status: 'Kết quả sẵn sàng', 
      orderDate: '2025-05-28',
      expectedResults: '2025-06-02'
    },
    { 
      id: 3, 
      customerId: 3, 
      customerName: 'Nguyễn Minh Khôi',
      testType: 'Xét nghiệm HIV', 
      status: 'Đang xử lý', 
      orderDate: '2025-06-03',
      expectedResults: '2025-06-07'
    }
  ]);

  const [newTest, setNewTest] = useState({
    customerId: '',
    testType: '',
    orderDate: '',
    notes: ''
  });

  const [editingTest, setEditingTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const testTypes = [
    'Gói xét nghiệm STI toàn diện',
    'Xét nghiệm Chlamydia/Gonorrhea',
    'Xét nghiệm HIV',
    'Xét nghiệm Giang mai',
    'Xét nghiệm Herpes',
    'Xét nghiệm Viêm gan B/C'
  ];

  const statusColors = {
    'Chờ xử lý': 'bg-yellow-100 text-yellow-800',
    'Đã lấy mẫu': 'bg-blue-100 text-blue-800',
    'Đang xử lý': 'bg-purple-100 text-purple-800',
    'Kết quả sẵn sàng': 'bg-green-100 text-green-800',
    'Đã giao kết quả': 'bg-gray-100 text-gray-800'
  };

  const handleAddTest = () => {
    if (newTest.customerId && newTest.testType && newTest.orderDate) {
      const customer = customers.find(c => c.id === parseInt(newTest.customerId));
      const newOrder = {
        id: Date.now(),
        customerId: parseInt(newTest.customerId),
        customerName: customer.name,
        testType: newTest.testType,
        status: 'Chờ xử lý',
        orderDate: newTest.orderDate,
        expectedResults: new Date(new Date(newTest.orderDate).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: newTest.notes
      };
      setTestOrders([...testOrders, newOrder]);
      setNewTest({ customerId: '', testType: '', orderDate: '', notes: '' });
      setActiveTab('orders');
    }
  };

  const handleUpdateTest = () => {
    if (editingTest) {
      setTestOrders(testOrders.map(order => 
        order.id === editingTest.id ? editingTest : order
      ));
      setEditingTest(null);
    }
  };

  const handleDeliverResult = (orderId) => {
    setTestOrders(testOrders.map(order => 
      order.id === orderId ? { ...order, status: 'Đã giao kết quả' } : order
    ));
  };

  const filteredOrders = testOrders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-blue-600">{testOrders.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800">Chờ xử lý</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {testOrders.filter(o => o.status === 'Chờ xử lý').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800">Đang xử lý</h3>
          <p className="text-3xl font-bold text-purple-600">
            {testOrders.filter(o => o.status === 'Đang xử lý').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Sẵn sàng</h3>
          <p className="text-3xl font-bold text-green-600">
            {testOrders.filter(o => o.status === 'Kết quả sẵn sàng').length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Đơn hàng gần đây</h3>
        <div className="space-y-3">
          {testOrders.slice(0, 5).map(order => (
            <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{order.customerName}</span>
                <span className="text-gray-500 ml-2">- {order.testType}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAddTest = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Thêm xét nghiệm mới cho khách hàng</h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn khách hàng
            </label>
            <select
              value={newTest.customerId}
              onChange={(e) => setNewTest({...newTest, customerId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn khách hàng...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại xét nghiệm
            </label>
            <select
              value={newTest.testType}
              onChange={(e) => setNewTest({...newTest, testType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn loại xét nghiệm...</option>
              {testTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày đặt hàng
            </label>
            <input
              type="date"
              value={newTest.orderDate}
              onChange={(e) => setNewTest({...newTest, orderDate: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú (Tùy chọn)
            </label>
            <input
              type="text"
              value={newTest.notes}
              onChange={(e) => setNewTest({...newTest, notes: e.target.value})}
              placeholder="Ghi chú bổ sung..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleAddTest}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Thêm đơn xét nghiệm
        </button>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Xem danh sách xét nghiệm của khách hàng</h2>
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại xét nghiệm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dự kiến có kết quả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    {order.customerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.testType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.orderDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.expectedResults}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setEditingTest(order)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Cập nhật"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {order.status === 'Kết quả sẵn sàng' && (
                    <button
                      onClick={() => handleDeliverResult(order.id)}
                      className="text-green-600 hover:text-green-900"
                      title="Giao kết quả"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStatusTracking = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Trạng thái mẫu xét nghiệm và kết quả</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{order.customerName}</h3>
                <p className="text-gray-600">{order.testType}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Ngày đặt hàng:</span>
                <span>{order.orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Dự kiến có kết quả:</span>
                <span>{order.expectedResults}</span>
              </div>
            </div>

            {order.status === 'Kết quả sẵn sàng' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-medium">Kết quả đã sẵn sàng để giao cho khách hàng</p>
                <button
                  onClick={() => handleDeliverResult(order.id)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Giao kết quả cho khách hàng
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Hệ thống quản lý xét nghiệm STI - Giao diện nhân viên</h1>
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6 text-gray-600" />
              <span className="text-gray-700">Nhân viên</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-8 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'dashboard' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Bảng điều khiển</span>
          </button>
          
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'add' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm xét nghiệm mới</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'orders' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Xem danh sách xét nghiệm</span>
          </button>
          
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'status' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Trạng thái mẫu & Kết quả</span>
          </button>
        </nav>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'add' && renderAddTest()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'status' && renderStatusTracking()}
      </div>

      {editingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Cập nhật thông tin xét nghiệm</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={editingTest.status}
                  onChange={(e) => setEditingTest({...editingTest, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đã lấy mẫu">Đã lấy mẫu</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Kết quả sẵn sàng">Kết quả sẵn sàng</option>
                  <option value="Đã giao kết quả">Đã giao kết quả</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày dự kiến có kết quả
                </label>
                <input
                  type="date"
                  value={editingTest.expectedResults}
                  onChange={(e) => setEditingTest({...editingTest, expectedResults: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateTest}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Cập nhật
              </button>
              <button
                onClick={() => setEditingTest(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default STITestOrdersInterface;
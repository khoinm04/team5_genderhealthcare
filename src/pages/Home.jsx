import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-blue-100 flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-900 leading-tight">
            Gender Healthcare Service Management System
          </h1>
          <p className="text-lg text-cyan-700">
            Phần mềm quản lý dịch vụ chăm sóc sức khỏe giới tính chuyên nghiệp, tiện lợi, dễ sử dụng giúp nâng cao trải nghiệm khách hàng và hiệu quả quản lý.
          </p>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1588776814546-cd340945ffea?auto=format&fit=crop&w=600&q=80"
            alt="Healthcare illustration"
            className="rounded-lg shadow-lg"
          />
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-cyan-800 mb-10 text-center">Tính năng nổi bật</h2>
          <div className="row row-cols-1 row-cols-md-3 g-6">
            <div className="col">
              <div className="card border-0 shadow-sm p-4 h-100">
                <div className="text-cyan-600 text-4xl mb-4">🗂️</div>
                <h5 className="card-title font-semibold mb-2">Quản lý hồ sơ khách hàng</h5>
                <p className="card-text text-cyan-700">
                  Lưu trữ và cập nhật thông tin sức khỏe, lịch sử chăm sóc, giúp cá nhân hóa dịch vụ.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="card border-0 shadow-sm p-4 h-100">
                <div className="text-cyan-600 text-4xl mb-4">📅</div>
                <h5 className="card-title font-semibold mb-2">Lịch hẹn thông minh</h5>
                <p className="card-text text-cyan-700">
                  Tự động nhắc nhở lịch khám và dịch vụ chăm sóc giúp khách hàng không bỏ lỡ các buổi hẹn quan trọng.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="card border-0 shadow-sm p-4 h-100">
                <div className="text-cyan-600 text-4xl mb-4">📊</div>
                <h5 className="card-title font-semibold mb-2">Báo cáo & Phân tích</h5>
                <p className="card-text text-cyan-700">
                  Tổng hợp số liệu hiệu quả dịch vụ, giúp tối ưu hóa quy trình và nâng cao chất lượng chăm sóc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

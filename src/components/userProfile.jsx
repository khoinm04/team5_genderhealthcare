import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X, Camera, Lock, Eye, EyeOff, ArrowLeft, Home } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [saveMessage, setSaveMessage] = useState('');

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  const [tempData, setTempData] = useState(profileData);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });



  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const { token, ...userInfo } = parsedUser;

        if (!token) {
          console.warn("Không có token trong localStorage.");
          return fallbackToSessionStorage();
        }

        // Set user temporarily, then re-validate if needed
        setProfileData(userInfo);

        // Call API to validate token or fetch the latest avatar and name if needed
        axios.get("http://localhost:8080/gender-health-care/signingoogle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            const userData = res.data.user;
            localStorage.setItem("user", JSON.stringify({ ...userData, token }));
            sessionStorage.setItem("user", JSON.stringify(userData));
            setProfileData(userData);
          })
          .catch((err) => {
            console.error("Token không hợp lệ hoặc đã hết hạn:", err);
            localStorage.removeItem("user");
            fallbackToSessionStorage();
          });

      } catch (e) {
        console.error("Không parse được user từ localStorage:", e);
        fallbackToSessionStorage();
      }
    } else {
      fallbackToSessionStorage();
    }

    function fallbackToSessionStorage() {
      const sessionUser = sessionStorage.getItem("user");
      if (sessionUser) {
        try {
          const parsed = JSON.parse(sessionUser);
          setProfileData(parsed);
        } catch (e) {
          console.error("Lỗi parse user trong sessionStorage:", e);
          sessionStorage.removeItem("user");
        }
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
    setSaveMessage('Lưu thành công!');

    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPasswordStrength = () => {
    const password = passwordData.newPassword;
    if (!password) return { strength: 0, label: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['Rất Yếu', 'Yếu', 'Trung Bình', 'Tốt', 'Mạnh'];
    const colors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-200'
    };
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Shield }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      {/* Full Name */}
      <div className="flex items-center">
        <label className="w-1/3 text-sm font-medium text-gray-700 pr-4">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <div className="w-2/3">
          {isEditing ? (
            <input
              type="text"
              value={tempData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData.fullName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center">
        <label className="w-1/3 text-sm font-medium text-gray-700 pr-4">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="w-2/3">
          <div className="px-4 py-3 bg-gray-100 rounded-lg flex items-center text-gray-500">
            <Mail className="w-5 h-5 mr-3 text-gray-400" />
            <span>{profileData.email}</span>
            <span className="ml-3 text-xs text-gray-400">(Không thể thay đổi)</span>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center">
        <label className="w-1/3 text-sm font-medium text-gray-700 pr-4">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <div className="w-2/3">
          {isEditing ? (
            <input
              type="tel"
              value={tempData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
              <Phone className="w-5 h-5 mr-3 text-gray-500" />
              <span>{profileData.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Gender */}
      <div className="flex items-center">
        <label className="w-1/3 text-sm font-medium text-gray-700 pr-4">
          Giới tính <span className="text-red-500">*</span>
        </label>
        <div className="w-2/3">
          {isEditing ? (
            <select
              value={tempData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="female">Nữ</option>
              <option value="male">Nam</option>
              <option value="other">Khác</option>
            </select>
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg">
              {profileData.gender === 'female' ? 'Nữ' :
                profileData.gender === 'male' ? 'Nam' :
                  profileData.gender === 'other' ? 'Khác' : 'Chưa chọn'}
            </p>
          )}
        </div>
      </div>

      {/* Date of Birth */}
      <div className="flex items-center">
        <label className="w-1/3 text-sm font-medium text-gray-700 pr-4">
          Ngày sinh <span className="text-red-500">*</span>
        </label>
        <div className="w-2/3">
          {isEditing ? (
            <input
              type="date"
              value={tempData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              <span>{new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Move Edit button here */}
      <div className="flex justify-center mt-4">
        {activeTab === 'personal' && (
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-medium text-orange-800 mb-2 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Bảo mật tài khoản
        </h4>
        <p className="text-sm text-orange-600">
          Thay đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn
        </p>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <h5 className="text-lg font-semibold text-gray-800 mb-6">Đổi mật khẩu</h5>

        <div className="space-y-6">
          {/* Current Password */}
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-gray-700 pr-4">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="w-2/3">
              <div className="relative">
                <input
                  // type={showPassword.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword.current ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* New Password */}
          <div className="flex items-start">
            <label className="w-1/3 text-sm font-medium text-gray-700 pr-4 pt-3">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="w-2/3">
              <div className="relative">
                <input
                  // type={showPassword.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword.new ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Độ mạnh mật khẩu:</span>
                    <span className={`text-sm font-medium ${getPasswordStrength().strength <= 2 ? 'text-red-500' :
                      getPasswordStrength().strength <= 3 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                      {getPasswordStrength().label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength().color}`}
                      style={{ width: `${(getPasswordStrength().strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Validation Criteria */}
              <div className="mt-4 flex space-x-4 text-sm text-gray-600">
                <div className={passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                  ✓ Ít nhất 8 ký tự
                </div>
                <div className={/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                  ✓ Chữ thường
                </div>
                <div className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                  ✓ Chữ hoa
                </div>
                <div className={/\d/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                  ✓ Số
                </div>
                <div className={/[^a-zA-Z\d]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}>
                  ✓ Ký tự đặc biệt
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex items-start">
            <label className="w-1/3 text-sm font-medium text-gray-700 pr-4 pt-3">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="w-2/3">
              <div className="relative">
                <input
                  // type={showPassword.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-start pl-[33.333333%]">
            <button
              onClick={handlePasswordSubmit}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                <button
                  onClick={handleBackToHome}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span className="text-base font-medium">Trang chủ</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'security' && renderSecurity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import LoginForm from '../components/LoginForm';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleLogin(username, password) {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      }, { withCredentials: true });
      setUser(response.data);
      navigate('/menstrual-cycles');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-gray-300 py-3 px-10 flex items-center">
        <span className="text-[#1C0C11] text-lg font-bold">Dịch vụ chăm sóc sức khỏe giới tính</span>
      </div>

      <div className="flex flex-col items-center flex-grow py-10 px-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <LoginForm onLogin={handleLogin} />
        <SocialLoginButtons />

        <p className="text-[#964F66] text-sm text-center my-4">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#8C66D9] hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
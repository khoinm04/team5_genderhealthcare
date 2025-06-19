import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ.');
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      setError('Vui lòng sử dụng địa chỉ Gmail.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', {
        email: email,
      });

      if (response.status === 200) {
        setMessage('Mã OTP đã được gửi đến ' + email);
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } }); // Chuyển sang trang verify
        }, 1000); // Chờ 1 giây cho người dùng thấy message
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi gửi OTP. Vui lòng thử lại.');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Quên Mật Khẩu</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Địa chỉ Gmail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nhập Gmail của bạn"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm italic mb-4">{message}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Gửi OTP
            </button>
            <a
              href="/login"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Quay lại đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

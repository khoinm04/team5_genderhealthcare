import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpPasswordForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
            setError('Vui lòng nhập mã OTP 6 số hợp lệ');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-otp', {
                email: email,
                otp: otpValue
            });

            if (response.data) {
                setMessage('Mã OTP hợp lệ');
                setError('');
            }
        } catch (error) {
            setError(error.response?.data || 'Mã OTP không hợp lệ');
        }
    };

    const handleResetPassword = async () => {
        if (password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return;
        }
        if (password !== rePassword) {
            setError('Mật khẩu nhập lại không khớp');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', {
                email: email,
                otp: otp.join(''),
                newPassword: password
            });

            setMessage('Đổi mật khẩu thành công');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError(error.response?.data || 'Có lỗi xảy ra khi đổi mật khẩu');
        }
    };

    const OTPInput = () => (
        <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[index] = e.target.value;
                        setOtp(newOtp);
                        if (e.target.value && index < 5) {
                            document.getElementById(`otp-${index + 1}`).focus();
                        }
                    }}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Xác thực OTP và Đổi mật khẩu</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

                <OTPInput />

                <div className="flex flex-col gap-4 mb-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full p-3 text-base border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full p-3 text-base border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleVerifyOtp}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Xác thực OTP
                    </button>
                    <button
                        onClick={handleResetPassword}
                        className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpPasswordForm;
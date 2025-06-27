import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import BlogPage from "./components/BlogPage";
import LoginPage from "./components/LoginPage";
import { UserContext } from "./UserContext";
import ConsultationBooking from "./components/ConsultationBooking";
import Register from "./components/register";
import AdminDashboard from "./components/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import OtpPasswordForm from "./components/OtpPasswordForm";
import GoogleCallback from "./pages/GoogleCallback";
import STIsTestPage from "./components/STIsTestPage";
import PaymentPage from "./components/PaymentPage";
import StaffDashboard from "./components/StaffDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import ReproductiveHealthApp from "./pages/ReproductiveHealthApp";


export default function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user từ localStorage hoặc Google
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Nếu không có user trong localStorage, thử check Google login
      axios
        .get("http://localhost:8080/gender-health-care/signingoogle", {
          withCredentials: true,
        })
        .then((res) => {
          const userData = res.data.user;

          if (userData && userData.createdAt) {
            userData.formattedCreateAt = format(new Date(userData.createdAt), "M/d/yyyy, h:mm:ss a");
          } else {
            userData.formattedCreateAt = "Không có ngày tạo";
          }

          setUser(userData);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  // ✅ Đồng bộ user giữa các tab khi login/logout
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(newUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking/consultation" element={<ConsultationBooking />} />
          <Route path="/booking/sti" element={<STIsTestPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpPasswordForm />} />
          <Route path="/oauth2-success" element={<GoogleCallback />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/booking/menstrual" element={<ReproductiveHealthApp />} />

          {/* Thêm các route khác nếu cần */}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

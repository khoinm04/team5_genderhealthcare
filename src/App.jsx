import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/Homepage";
import GoogleCallback from "./pages/GoogleCallback";

// Auth Components
import LoginPage from "./components/auth/LoginPage";
import Register from "./components/auth/register";
import ForgotPassword from "./components/auth/ForgotPassword";
import OtpPasswordForm from "./components/auth/OtpPasswordForm";

// Blog Components
import BlogPage from "./components/blog/BlogPage";

// Dashboard Components
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ManagerDashboard from "./components/dashboard/ManagerDashboard";

// Management Components
import ConsultantManagement from "./components/management/ConsultantManagement";
import ManagementDashboard from "./components/management/Dashboard";
import ScheduleManagement from "./components/management/ScheduleManagement";
import ServiceManagement from "./components/management/ServiceManagement";
import Sidebar from "./components/management/Sidebar";
import StaffManagement from "./components/management/StaffManagement";

// Healthcare Components
import ConsultationBooking from "./components/healthcare/ConsultationBooking";
import STIsTestPage from "./components/healthcare/STIsTestPage";

// Menstrual Components
import MenstrualCycleForm from "./components/menstrual/MenstrualCycleForm";

// Common Components
import PaymentPage from "./components/common/PaymentPage";

// Context
import { UserContext } from "./context/UserContext";

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
          <Route path="/booking/menstrual" element={<MenstrualCycleForm />} />
          <Route path="/booking/sti" element={<STIsTestPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpPasswordForm />} />
          <Route path="/oauth2-success" element={<GoogleCallback />} />
          <Route path="/management" element={<ManagerDashboard />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
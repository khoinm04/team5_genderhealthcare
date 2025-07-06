import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import BlogPage from "./components/blog/BlogPage";
import LoginPage from "./components/auth/LoginPage";
import { UserContext } from "./UserContext";
import ConsultationBooking from "./components/consultation/ConsultationBooking";
import Register from "./components/auth/register";
import AdminDashboard from "./components/admin/AdminDashboard";
import ForgotPassword from "./components/auth/ForgotPassword";
import OtpPasswordForm from "./components/auth/OtpPasswordForm";
import GoogleCallback from "./pages/GoogleCallback";
import STIsTestPage from "./components/STIs/STIsTestPage";
import StaffDashboard from "./components/staff/StaffDashboard";
import ManagerDashboard from "./components/manager/ManagerDashboard";
import ScheduleManagement from './components/manager/ScheduleManagement';
import ReproductiveHealthApp from "./pages/ReproductiveHealthApp";
import ConsultantDashboard from "./components/consultant/ConsultantDashboard";
import UserProfile from "./components/UserProfile";
import AppointmentHistory from "./components/AppointmentHistory";
import BookingSuccessWrapper from "./components/BookingSuccessWrapper";

import { usePillReminderSocket } from "./hooks/usePillReminderSocket";



import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function App() {
  const [user, setUser] = useState(null);

  // ✅ Kết nối socket nhắc nhở nếu đã có user

  usePillReminderSocket();


  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
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
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpPasswordForm />} />
          <Route path="/oauth2-success" element={<GoogleCallback />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/schedules" element={<ScheduleManagement />} />
          <Route path="/booking/menstrual" element={<ReproductiveHealthApp />} />
          <Route path="/consultant" element={<ConsultantDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/orders" element={<AppointmentHistory />} />
          <Route path="/booking-success" element={<BookingSuccessWrapper />} />
          
          <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />

        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </UserContext.Provider>
  );
}

// nhớ tải npm install react-icons
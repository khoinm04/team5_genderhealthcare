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
import MenstrualCycleForm from "./components/MenstrualCycleForm";
import STIsTestPage from "./components/STIsTestPage";
import PaymentPage from "./components/PaymentPage";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/gender-health-care/signingoogle", {
        withCredentials: true,
      })
      .then((res) => {
        const userData = res.data.user;

        if (userData && userData.createdAt) {
          userData.formattedCreateAt = format(new Date(userData.createdAt), 'M/d/yyyy, h:mm:ss a');
        } else {
          userData.formattedCreateAt = 'Không có ngày tạo';
        }

        setUser(userData);
      })
      .catch(() => {
        setUser(null);
      });
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
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
  // import các component khác nếu có
}
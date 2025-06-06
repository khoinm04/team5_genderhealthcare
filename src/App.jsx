import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import { UserContext } from "./UserContext";
import ConsultationBooking from "./components/ConsultationBooking";
import STIBookingPage from "./components/STIBookingPage";
import MenstrualBookingPage from "./components/MenstrualBookingPage";
import Services from "./components/Services";
import Register from "./components/register";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/gender-health-care/signingoogle", {
        withCredentials: true, // để gửi cookie nếu có
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>; // Thông báo khi đang tải dữ liệu
  }

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking/consultation" element={<ConsultationBooking />} />
          <Route path="/booking/menstrual" element={<MenstrualBookingPage />} />
          <Route path="/booking/sti" element={<STIBookingPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";   // Đã import BlogPost
import LoginPage from "./pages/LoginPage";
import { UserContext } from "./UserContext";
import ConsultationBooking from "./components/ConsultationBooking";
import STIBookingPage from "./pages/STIBookingPage";
import MenstrualBookingPage from "./pages/MenstrualCyclePage";
import Services from "./components/Services";
import Register from "./components/register";
import UserGroupDetail from "./components/UserGroupDetail";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/gender-health-care/signingoogle", {
        withCredentials: true,
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
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />  {/* THÊM DÒNG NÀY */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking/consultation" element={<ConsultationBooking />} />
          <Route path="/booking/menstrual" element={<MenstrualBookingPage />} />
          <Route path="/booking/sti" element={<STIBookingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/groups/:groupSlug" element={<UserGroupDetail />} />
          
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

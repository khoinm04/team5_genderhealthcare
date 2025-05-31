import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import BlogPage from "./components/BlogPage";
import LoginPage from "./components/LoginPage";
// import các component khác nếu có

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* các route khác */}
      </Routes>
    </BrowserRouter>
  );
}

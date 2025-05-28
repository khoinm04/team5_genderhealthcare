import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import HomePage from "./components/HomePage"
import LoginPage from "./components/LoginPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

import React, { useState } from "react";
import MenstrualCycleForm from "../components/MenstrualCycleForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewCyclePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setLoading(true);
      await axios.post("/api/menstrual-cycles/track", data);
      alert("Thêm mới thành công!");
      navigate("/menstrual-cycles");
    } catch (error) {
      alert(error?.response?.data?.message || "Lỗi khi thêm mới chu kỳ!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MenstrualCycleForm
      cycle={null}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/menstrual-cycles")}
      loading={loading}
    />
  );
}

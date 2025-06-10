import React, { useEffect, useState } from "react";
import MenstrualCycleForm from "../components/MenstrualCycleForm";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCyclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCycle() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/menstrual-cycles/${id}`);
        setCycle(res.data);
      } catch {
        alert("Không tìm thấy chu kỳ!");
        navigate("/menstrual-cycles");
      } finally {
        setLoading(false);
      }
    }
    fetchCycle();
  }, [id, navigate]);

  async function handleSubmit(data) {
    try {
      setLoading(true);
      await axios.put(`/api/menstrual-cycles/${id}`, data);
      alert("Cập nhật thành công!");
      navigate("/menstrual-cycles");
    } catch (error) {
      alert(error?.response?.data?.message || "Lỗi khi cập nhật chu kỳ!");
    } finally {
      setLoading(false);
    }
  }

  return (
    cycle && (
      <MenstrualCycleForm
        cycle={cycle}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/menstrual-cycles")}
        loading={loading}
      />
    )
  );
}

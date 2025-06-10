import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MenstrualCycleInfo from "./MenstrualCycleInfo";
import MenstrualCycleActions from "./MenstrualCycleActions";

const MenstrualCycleDetail = ({ customerId }) => {
  const { id } = useParams();
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCycle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/menstrual-cycles/${id}`);
        setCycle(res.data);
      } catch (e) {
        setCycle(null);
      }
      setLoading(false);
    };
    fetchCycle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    await axios.delete(`/api/menstrual-cycles/${id}`);
    navigate("/menstrual-cycles");
  };

  if (loading) return <div>Đang tải...</div>;
  if (!cycle) return <div>Không tìm thấy chu kỳ!</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <MenstrualCycleInfo cycle={cycle} />
      <MenstrualCycleActions
        cycle={cycle}
        onEdit={() => navigate(`/menstrual-cycles/${id}/edit`)}
        onDelete={handleDelete}
      />
      <button
        className="mt-4 px-4 py-2 bg-gray-300 rounded"
        onClick={() => navigate("/menstrual-cycles")}
      >
        Quay lại danh sách
      </button>
    </div>
  );
};

export default MenstrualCycleDetail;

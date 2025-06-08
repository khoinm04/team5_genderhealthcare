import React, { useEffect, useState } from "react";
import MenstrualCycleForm from "../components/MenstrualCycleInfo";
import MenstrualCycleInfo from "../components/MenstrualCycleActions";
import MenstrualCycleActions from "../components/MenstrualCycleForm";
import axios from "axios";

const customerId = 1; // Thay bằng ID đăng nhập thực tế

const MenstrualCyclePage = () => {
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCycle = async () => {
    try {
      const res = await axios.get(`/api/menstrual-cycles/customer/${customerId}/current`);
      setCycle(res.data);
    } catch (err) {
      setCycle(null);
    }
  };

  useEffect(() => {
    fetchCycle();
  }, []);

  const handleSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      let res;
      if (cycle && editing) {
        res = await axios.put(
          `/api/menstrual-cycles/customer/${customerId}/cycles/${cycle.cycleId}`,
          {
            ...cycle,
            ...data,
          }
        );
        setMessage("Cập nhật thành công!");
      } else {
        res = await axios.post(`/api/menstrual-cycles/track`, {
          customerId,
          ...data,
        });
        setMessage("Tạo mới thành công!");
      }
      setCycle(res.data);
      setEditing(false);
    } catch (err) {
      setMessage("Có lỗi xảy ra: " + (err.response?.data || err.message));
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn chắc chắn muốn xóa chu kỳ này?")) {
      try {
        await axios.delete(`/api/menstrual-cycles/customer/${customerId}/cycles/${cycle.cycleId}`);
        setMessage("Đã xóa chu kỳ thành công!");
        setCycle(null);
      } catch (err) {
        setMessage("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-200 p-6">
      {message && (
        <div className="max-w-lg mx-auto mb-4">
          <div className="alert alert-info text-center rounded bg-blue-100 text-blue-800 p-2">{message}</div>
        </div>
      )}

      {!cycle || editing ? (
        <MenstrualCycleForm
          onSubmit={handleSubmit}
          loading={loading}
          initial={editing ? cycle : null}
        />
      ) : (
        <>
          <MenstrualCycleInfo cycle={cycle} />
          <MenstrualCycleActions
            cycle={cycle}
            onDelete={handleDelete}
            onEdit={() => setEditing(true)}
          />
        </>
      )}
    </div>
  );
};

export default MenstrualCyclePage;

import React, { useState } from "react";
import axios from "axios";

const MenstrualCycleForm = () => {
  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [menstruationDuration, setMenstruationDuration] = useState(5);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = Number(sessionStorage.getItem("userId")); // ✅ Lấy userId từ sessionStorage

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/menstrual-cycles/track",
        {
          customer: {
            userId: userId,
          },
          startDate,
          cycleLength: Number(cycleLength),
          menstruationDuration: Number(menstruationDuration),
          notes,
        },
        {
          withCredentials: true, // ✅ Giữ cookie hoặc token nếu cần
        }
      );

      alert("Theo dõi thành công!");
      console.log("Phản hồi từ server:", response.data);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-[#8f5ed3] mb-2">
        Theo dõi chu kỳ kinh nguyệt
      </h2>

      <div>
        <label className="block font-semibold mb-1">Ngày bắt đầu</label>
        <input
          type="date"
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Số ngày giữa 2 chu kỳ</label>
        <input
          type="number"
          min={20}
          max={45}
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={cycleLength}
          onChange={(e) => setCycleLength(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Số ngày hành kinh</label>
        <input
          type="number"
          min={1}
          max={10}
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={menstruationDuration}
          onChange={(e) => setMenstruationDuration(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Ghi chú</label>
        <input
          type="text"className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={255}
        />
      </div>

      <button
        type="submit"
        className="bg-[#8f5ed3] text-white font-bold px-5 py-2 rounded-md hover:bg-[#68409c] transition"
        disabled={loading}
      >
        {loading ? "Đang lưu..." : "Lưu thông tin"}
      </button>
    </form>
  );
};

export default MenstrualCycleForm;
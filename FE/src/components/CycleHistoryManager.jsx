import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CycleHistoryCalendar from "./CycleHistoryCalendar";
import {
  Calendar,
  Edit3,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CycleHistoryManager = ({ onClose }) => {
  const [historyList, setHistoryList] = useState([]);
  const [editingCycle, setEditingCycle] = useState(null);
  const [addingCycle, setAddingCycle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem("token");
  const [showHistoryCalendar, setShowHistoryCalendar] = useState(false);

  // Helper format date YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 10);
  };

  // lấy danh sách
  const fetchHistory = async () => {
    try {
      const res = await axios.get("/api/menstrual-cycle-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistoryList(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Lỗi lấy lịch sử chu kỳ!");
      console.error(error);
    }
  };
  console.log(historyList);
  useEffect(() => {
  console.log("History updated:", historyList);
}, [historyList]);


  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, []);

  const handleEditCycle = (cycle) => {
    setEditingCycle(cycle);
    setAddingCycle(null);
  };

  const handleCloseEditModal = () => {
    setEditingCycle(null);
    setAddingCycle(null);
  };

  const validateCycle = (cycle) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(cycle.startDate);
    const end = new Date(cycle.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const cycleLength = Math.round((end - start) / (1000 * 60 * 60 * 24));

    // 1. Ngày kết thúc không được ở tương lai
    if (end > today) {
      toast.error("Ngày kết thúc không được ở tương lai.");
      return false;
    }
    // 2. Ngày kết thúc không được trước ngày bắt đầu
    if (end < start) {
      toast.error("Ngày kết thúc không được trước ngày bắt đầu.");
      return false;
    }
    // 3. Độ dài chu kỳ phải từ 15 ngày trở lên
    if (cycleLength < 15) {
      toast.error("Độ dài chu kỳ phải từ 15 ngày trở lên!");
      return false;
    }
    // 4. Ngày bắt đầu nên ở quá khứ hoặc hôm nay
    if (start >= today) {
      toast.error("Ngày bắt đầu nên ở quá khứ.");
      return false;
    }
    // Thời gian hành kinh không vượt quá độ dài chu kỳ
    if (cycle.menstruationDuration > cycleLength) {
      toast.error("Thời gian hành kinh không được dài hơn độ dài chu kỳ");
      return false;
    }
    return true;
  };

  // Chỉnh sửa lịch sử chu kỳ
  const handleSaveEditCycle = async (updatedCycle) => {
    // Validate
    if (!validateCycle(updatedCycle)) return;

    if (new Date(updatedCycle.endDate) <= new Date(updatedCycle.startDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }
    if (
      updatedCycle.menstruationDuration >
      (new Date(updatedCycle.endDate) - new Date(updatedCycle.startDate)) /
        (1000 * 60 * 60 * 24)
    ) {
      toast.error("Thời gian hành kinh không được dài hơn độ dài chu kỳ");
      return;
    }

    try {
      await axios.put(
        `/api/menstrual-cycle-history/${updatedCycle.historyId}`,
        null,
        {
          params: {
            startDate: formatDate(updatedCycle.startDate),
            endDate: formatDate(updatedCycle.endDate),
            menstruationDuration: updatedCycle.menstruationDuration,
            note: updatedCycle.note || "",
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Đã cập nhật chu kỳ lịch sử thành công!");
      setEditingCycle(null);
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || "Cập nhật chu kỳ thất bại!");
      console.error(error);
    }
  };

  // Thêm mới một chu kỳ vào lịch sử
  const handleSaveAddCycle = async (newCycle) => {
    if (!validateCycle(newCycle)) return;

    if (new Date(newCycle.endDate) <= new Date(newCycle.startDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }
    if (
      newCycle.menstruationDuration >
      (new Date(newCycle.endDate) - new Date(newCycle.startDate)) /
        (1000 * 60 * 60 * 24)
    ) {
      toast.error("Thời gian hành kinh không được dài hơn độ dài chu kỳ");
      return;
    }
    try {
      const res = await axios.post("/api/menstrual-cycle-history", null, {
        params: {
          startDate: formatDate(newCycle.startDate),
          endDate: formatDate(newCycle.endDate),
          menstruationDuration: newCycle.menstruationDuration,
          note: newCycle.note || "",
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã thêm chu kỳ lịch sử thành công!");
      setAddingCycle(null);
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || "Thêm chu kỳ thất bại!");
      console.error(error);
    }
  };

  // Xóa một chu kỳ khỏi lịch sử
  const handleDeleteCycleHistory = async (cycle) => {
    if (
      !window.confirm(
        `Bạn chắc chắn muốn xóa chu kỳ bắt đầu ${formatDate(
          cycle.startDate
        )} không?`
      )
    )
      return;

    try {
      await axios.delete(`/api/menstrual-cycle-history/${cycle.historyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa chu kỳ lịch sử thành công!");
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.error || "Xóa chu kỳ thất bại!");
      console.error(error);
    }
  };

  const EditModal = ({ visible, cycle, onClose, onSave }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [menstruationDuration, setMenstruationDuration] = useState(5);
    const [cycleLength, setCycleLength] = useState(28);
    const [note, setNote] = useState("");
    useEffect(() => {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
        setCycleLength(diffDays > 0 ? diffDays : 0);
      }
    }, [startDate, endDate]);

    useEffect(() => {
      if (cycle) {
        setStartDate(formatDate(cycle.startDate));
        setEndDate(formatDate(cycle.endDate));
        setMenstruationDuration(cycle.menstruationDuration || 5);
        setCycleLength(cycle.cycleLength || 28);
        setNote(cycle.note || "");
      }
    }, [cycle]);

    if (!visible) return null;

    const handleSubmit = () => {
      if (new Date(endDate) <= startDate) {
        toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
        return;
      }

      if (!startDate || !endDate || !menstruationDuration) {
        toast.error("Vui lòng điền đầy đủ thông tin.");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (new Date(startDate) >= today) {
        toast.error("Ngày bắt đầu phải ở quá khứ.");
        return;
      }

      if (new Date(endDate) >= today) {
        toast.error("Ngày kết thúc phải ở quá khứ.");
        return;
      }

      onSave({
        ...cycle,
        startDate,
        endDate,
        menstruationDuration,
        cycleLength,
        note,
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">
              {cycle?.historyId ? "Chỉnh sửa chu kỳ" : "Thêm lịch sử chu kỳ"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian hành kinh (ngày)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  value={menstruationDuration}
                  onChange={(e) =>
                    setMenstruationDuration(Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ dài chu kỳ (ngày)
                </label>
                <input
                  type="number"
                  min={21}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  value={cycleLength}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                placeholder="Nhập ghi chú..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalPages = Math.ceil(historyList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = historyList.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            Lịch sử các chu kỳ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Bắt đầu
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Kết thúc
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Hành kinh (ngày)
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Độ dài chu kỳ
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Ghi chú
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                    >
                      Chưa có lịch sử
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr key={item.historyId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {formatDate(item.startDate)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {formatDate(item.endDate)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                        {item.menstruationDuration}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                        {item.cycleLength}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {item.note || "-"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditCycle(item)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCycleHistory(item)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-pink-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-pink-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-pink-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-center items-center gap-4">
          <button
            onClick={() => {
              setAddingCycle({
                startDate: "",
                endDate: "",
                menstruationDuration: 5,
                cycleLength: 28,
                note: "",
              });
              setEditingCycle(null);
            }}
            className="min-w-[170px] px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Thêm lịch sử chu kỳ
          </button>
          <button
            onClick={() => setShowHistoryCalendar(true)}
            className="min-w-[150px] px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Xem lịch sử
          </button>

          <button
            onClick={onClose}
            className="min-w-[100px] px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>

      <EditModal
        visible={!!(editingCycle || addingCycle)}
        cycle={editingCycle || addingCycle}
        onClose={handleCloseEditModal}
        onSave={editingCycle ? handleSaveEditCycle : handleSaveAddCycle}
      />
      {showHistoryCalendar && (
        <CycleHistoryCalendar
          historyList={historyList}
          onClose={() => setShowHistoryCalendar(false)}
        />
      )}
    </div>
  );
};

export default CycleHistoryManager;

import { useState, useEffect } from "react";
import axios from "axios";
import { Video, VideoOff, Clock } from "lucide-react";

const OnlineConsultation = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [consultationNote, setConsultationNote] = useState("");
  const [consultationTime, setConsultationTime] = useState(0);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        // 🔧 Sửa lỗi currentUser not defined
        const currentUser = JSON.parse(localStorage.getItem("user")); // ✅ THÊM DÒNG NÀY

        const consultantId = currentUser?.userId;
        const token = localStorage.getItem("token");

        console.log("🔎 currentUser:", currentUser); // => Kiểm tra user có tồn tại không
        console.log("🔑 token:", token); // => Kiểm tra token có tồn tại không

        if (!consultantId || !token) {
          console.warn("Thiếu consultantId hoặc token");
          return;
        }

        const url = `/api/consultations/consultant/${consultantId}/all`;
        console.log("📡 Gọi API:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Kết quả:", response.data);
        setConsultations(response.data.consultations);
      } catch (err) {
        console.error("❌ API lỗi:", err.response?.data || err.message);
      }
    };

    fetchConsultations();
  }, []);

  useEffect(() => {
    let interval;

    if (isInCall) {
      interval = setInterval(() => {
        setConsultationTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval); // 👈 cleanup khi component unmount hoặc isInCall = false
  }, [isInCall]);

  // Helper: Lấy ký tự viết tắt tên
  const getAvatarText = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const initials = words
      .slice(-2)
      .map((word) => word[0])
      .join("");
    return initials.toUpperCase();
  };

  const completeConsultation = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser || !token) {
        alert("Không xác định được người dùng hoặc token");
        return;
      }

      const response = await axios.post(
        `/api/consultations/${currentSession.consultationId}/complete`,
        null, // Không cần body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = response.data.consultation;
      console.log("✅ Cập nhật trạng thái thành COMPLETED:", updated);
      alert("Buổi tư vấn đã được đánh dấu là hoàn thành!");

      // Cập nhật UI
      setIsInCall(false);
      setConsultationTime(0);
      setConsultations((prev) =>
        prev.map((c) =>
          c.consultationId === updated.consultationId ? updated : c
        )
      );
    } catch (err) {
      console.error(
        "❌ Không thể đánh dấu hoàn thành:",
        err.response?.data || err.message
      );
      alert("Không thể đánh dấu hoàn thành. Vui lòng thử lại.");
    }
  };

  // Helper: Format ngày + khung giờ
  const formatTimeRange = (dateStr, timeSlot) => {
    const [start, end] = timeSlot.split(" - ");
    const options = { weekday: "short", day: "numeric", month: "short" };
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("vi-VN", options);
    return `${formattedDate}, ${start} - ${end}`;
  };

  // Helper: Định dạng thời gian từ giây => mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startConsultation = async (session) => {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !token) {
      alert("Không xác định được người dùng hoặc token");
      return;
    }

    try {
      const consultationId = session.consultationId;
      // Gọi API backend để cập nhật trạng thái và nhận meetLink
      const response = await axios.put(
        `/api/consultations/${consultationId}/start`,
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedSession = response.data.consultation; // ✅ Lấy đúng property từ response

      if (!updatedSession.meetLink) {
        alert("Không thể lấy liên kết Google Meet!");
        return;
      }

      // ✅ Cập nhật trạng thái UI
      setIsInCall(true);
      setCurrentSession(updatedSession);

      // Mở meetLink mới được trả về
      window.open(updatedSession.meetLink, "_blank");

      // Optional: cập nhật lại danh sách consultation
      setConsultations((prev) =>
        prev.map((c) =>
          c.consultationId === updatedSession.consultationId
            ? updatedSession
            : c
        )
      );
    } catch (err) {
      console.error(
        "❌ Không thể bắt đầu tư vấn:",
        err.response?.data || err.message,
        err.response
      );
      alert("Không thể bắt đầu tư vấn. Vui lòng thử lại.");
    }
  };

  const endConsultation = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn kết thúc buổi tư vấn? Bạn sẽ được nhập ghi chú để gửi cho khách hàng."
    );
    if (!confirmed) return;

    // 👉 Mở modal để nhập ghi chú
    setShowNoteModal(true);
  };

  const submitNoteAndComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentSession) {
        alert("Không xác định được phiên tư vấn hoặc token");
        return;
      }

      // Gửi ghi chú
      await axios.put(
        `/api/consultations/${currentSession.consultationId}/notes`,
        { note: consultationNote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Đánh dấu hoàn thành
      await completeConsultation();

      // Reset UI
      setShowNoteModal(false);
      setConsultationNote("");
      setCurrentSession(null);
      setIsInCall(false);
    } catch (err) {
      console.error("❌ Lỗi khi gửi ghi chú:", err.response?.data || err.message, err);

      alert("Không thể gửi ghi chú hoặc hoàn thành buổi tư vấn.");
    }
  };

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    averageMinutes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/consultations/stats/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Không thể lấy thống kê", err);
      }
    };

    fetchStats();
  }, []);

  const mapStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "đang chờ";
      case "SCHEDULED":
        return "đã lên lịch";
      case "ONGOING":
        return "đang tư vấn";
      case "COMPLETED":
        return "hoàn thành";
      case "CANCELLED":
        return "đã huỷ";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tư vấn trực tuyến
        </h1>
        <p className="text-gray-600">
          Tiến hành tư vấn video với khách hàng của bạn
        </p>
      </div>

      {!isInCall ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Phiên sắp tới
            </h2>
            <div className="space-y-4">
              {consultations.map((session) => (
                <div
                  key={session.consultationId}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getAvatarText(session.customerName)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {session.customerName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {session.topic || "Chưa có chủ đề"}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeRange(
                            session.dateScheduled,
                            session.timeSlot
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Trạng thái màu badge */}
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          session.status === "PENDING"
                            ? "bg-green-100 text-green-800"
                            : session.status === "ONGOING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {mapStatus(session.status)}
                      </span>

                      {/* Nút tham gia tùy theo trạng thái */}
                      {session.status === "PENDING" ||
                      session.status === "ONGOING" ? (
                        <button
                          onClick={() => startConsultation(session)}
                          className="inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          {session.status === "ONGOING"
                            ? "Tiếp tục tư vấn"
                            : "Tham gia cuộc gọi"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                        >
                          <VideoOff className="w-4 h-4 mr-2" />
                          {session.status === "COMPLETED"
                            ? "Đã hoàn thành"
                            : "Không khả dụng"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Settings */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thống kê hôm nay
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phiên hôm nay</span>
                  <span className="font-medium">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng thời gian</span>
                  <span className="font-medium">{stats.totalMinutes} phút</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời lượng trung bình</span>
                  <span className="font-medium">
                    {Math.round(stats.averageMinutes)} phút
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Mẹo chuyên nghiệp</h3>
              <p className="text-sm text-blue-100">
                Luôn kiểm tra camera và microphone trước khi bắt đầu buổi tư vấn
                để đảm bảo trải nghiệm tốt nhất cho khách hàng.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 p-10">
          Buổi tư vấn đang diễn ra.
          <br />
          Khi kết thúc, nhấn <strong>Hoàn thành</strong> để cập nhật trạng thái.
          <br />
          <br />
          <button
            onClick={endConsultation}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Kết thúc & Hoàn thành
          </button>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ghi chú buổi tư vấn
            </h2>
            <textarea
              className="w-full border px-3 py-2 rounded mb-4"
              rows={5}
              placeholder="Nhập ghi chú bạn muốn gửi cho khách hàng"
              value={consultationNote}
              onChange={(e) => setConsultationNote(e.target.value)}
              maxLength={1000}
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowNoteModal(false)}
              >
                Hủy
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={submitNoteAndComplete}
              >
                Gửi và Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineConsultation;

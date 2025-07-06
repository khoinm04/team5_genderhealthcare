import { useState, useEffect } from "react";
import axios from "axios";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Settings,
  Users,
  MessageSquare,
  Share,
  Monitor,
  Clock,
  User,
} from "lucide-react";

const OnlineConsultation = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [consultationTime, setConsultationTime] = useState(0);
  const [isInCall, setIsInCall] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

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

      const response = await axios.put(
        "/api/consultations/complete",
        {
          consultationId: currentSession.consultationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Cập nhật trạng thái thành COMPLETED:", response.data);
      alert("Buổi tư vấn đã được đánh dấu là hoàn thành!");

      setIsInCall(false);
      setConsultationTime(0);

      // 🔄 Reload lại danh sách tư vấn
      setConsultations((prev) =>
        prev.map((c) =>
          c.consultationId === currentSession.consultationId
            ? { ...c, status: "COMPLETED" }
            : c
        )
      );
    } catch (err) {
      console.error(
        "❌ Không thể cập nhật trạng thái:",
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

  const endConsultation = () => {
    if (
      window.confirm(
        "Bạn có chắc muốn kết thúc và đánh dấu hoàn thành buổi tư vấn?"
      )
    ) {
      completeConsultation(); // ✅ gọi API cập nhật
    } else {
      console.log("⛔ Huỷ kết thúc");
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log("Gửi tin nhắn chat:", chatMessage);
      setChatMessage("");
    }
  };

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
                      <button
                        onClick={() => startConsultation(session)}
                        className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                          session.status === "PENDING" ||
                          session.status === "ONGOING"
                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        {session.status === "ONGOING"
                          ? "Tiếp tục tư vấn"
                          : session.status === "PENDING"
                          ? "Tham gia cuộc gọi"
                          : "Bắt đầu sớm"}
                      </button>
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
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Video className="w-4 h-4 mr-2" />
                  Kiểm tra Video & Âm thanh
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thống kê hôm nay
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phiên hôm nay</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng thời gian</span>
                  <span className="font-medium">2 giờ 45 phút</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời lượng trung bình</span>
                  <span className="font-medium">55 phút</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Video Call Area */}
          <div className="lg:col-span-3 bg-gray-900 rounded-xl overflow-hidden relative">
            {/* Client Video (Main) */}
            <div className="h-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <User className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold">Nguyễn Thị Hoa</h3>
                <p className="text-blue-100">Khách hàng</p>
              </div>
            </div>

            {/* Your Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              {isVideoOn ? (
                <div className="h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                      <User className="w-6 h-6" />
                    </div>
                    <p className="text-sm">Bạn</p>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gray-800 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Call Info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(consultationTime)}</span>
              </div>
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isAudioOn ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isVideoOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <Monitor className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={() => setShowChat(!showChat)}
                  className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={endConsultation}
                  className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                  <Phone className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div
            className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col ${
              showChat ? "block" : "hidden lg:flex"
            }`}
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "consultant"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs ${
                      msg.sender === "consultant"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    } rounded-lg p-3`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "consultant"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                />
                <button
                  onClick={sendChatMessage}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineConsultation;

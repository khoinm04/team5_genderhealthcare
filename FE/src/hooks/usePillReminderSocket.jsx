import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

export const usePillReminderSocket = () => {
  const clientRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!storedUser) return;

    let token, userId;
    try {
      const user = JSON.parse(storedUser);
      token = user?.token;
      userId = user?.userId;
    } catch (e) {
      console.error("❌ Lỗi khi parse user", e);
      return;
    }

    if (!token || !userId) return;

    const client = new Client({
      webSocketFactory: () => new WebSocket("ws://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("📡 STOMP:", str),
      onConnect: () => {
        console.log("✅ Kết nối STOMP pill reminder");

        client.subscribe(`/topic/user/${userId}`, (message) => {
          try {
            // Parse JSON, vì backend gửi object
            const data = JSON.parse(message.body);


            // Lấy đúng message string để xử lý
            const body = data.message;

            // ✅ Bỏ qua nếu là xác nhận
            if (body.startsWith("✅ Đã xác nhận uống viên")) {
              console.log("🔕 Bỏ qua toast vì đây là thông báo xác nhận.");
              return;
            }

            // ✅ Bỏ qua nếu vừa xác nhận
            if (window.justConfirmed) {
              console.log("🔕 Vừa xác nhận nên không hiển thị nhắc.");
              return;
            }

            // 🧠 Kiểm tra đã uống chưa trong hôm nay
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

            const pillHistory = JSON.parse(localStorage.getItem("pillHistory") || "{}");
            if (pillHistory[todayStr] === true) {
              console.log("🟢 Đã uống hôm nay rồi, không hiện toast nữa.");
              return;
            }

            // 👉 Nếu không match được format, vẫn hiển thị thông báo đơn giản
            const regex = /viên thứ (\d+) của vỉ (\d+) viên/;
            const match = body.match(regex);

            if (match) {
              const pillIndex = parseInt(match[1], 10);
              const pillType = match[2];
              toast.info(`🔔 Nhắc nhở: Đã đến giờ uống viên thứ ${pillIndex} của vỉ ${pillType} viên`);
            } else {
              toast.info(`🔔 Nhắc nhở: ${body}`);
            }

            console.log("🔔 Nhận được nhắc nhở:", body);
          } catch (e) {
            console.error("❌ Lỗi khi xử lý nhắc nhở:", e);
          }
        });
      },
      onDisconnect: () => console.log("❌ STOMP pill reminder disconnected"),
      onStompError: (frame) => console.error("❌ STOMP error:", frame),
      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, []);
};

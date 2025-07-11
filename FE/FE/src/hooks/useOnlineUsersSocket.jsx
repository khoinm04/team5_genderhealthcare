import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export const useOnlineUsersSocket = (onUpdate) => {
  const clientRef = useRef(null);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!storedUser) {
      console.log("⚠️ No user found in storage");
      return;
    }

    let token = null;
    let userId = null;

    try {
      const parsedUser = JSON.parse(storedUser);
      token = parsedUser?.token;
      userId = parsedUser?.userId;
      console.log("🔑 Token & UserID:", { userId, token });
    } catch (e) {
      console.error("❌ Failed to parse stored user:", e);
      return;
    }

    if (!token || !userId) {
      console.log("⚠️ Token or UserID missing");
      return;
    }

    const client = new Client({
      webSocketFactory: () => {
        console.log("🧪 Using raw WebSocket to ws://localhost:8080/ws");
        return new WebSocket("ws://localhost:8080/ws");
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("📡 STOMP:", str),
      onConnect: (frame) => {
        console.log("✅ STOMP connected!", frame);

        client.publish({
          destination: "/app/online",
          body: "",
        });

        client.subscribe("/topic/online-users", (message) => {
          try {
            const users = JSON.parse(message.body);
            onUpdateRef.current(users);
          } catch (e) {
            console.error("❌ Failed to parse message:", e);
          }
        });
      },
      onDisconnect: () => console.log("❌ STOMP disconnected"),
      onStompError: (frame) => console.error("❌ STOMP error:", frame),
      onWebSocketClose: (event) => console.error("🔄 WebSocket closed:", event),
      onWebSocketError: (error) => console.error("❌ WebSocket error:", error),
      reconnectDelay: 5000,
      heartbeatIncoming: 25000,
      heartbeatOutgoing: 25000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
        console.log("🛑 STOMP client deactivated");
      }
      clientRef.current = null;
    };
  }, []);

  // 👇 Gửi tín hiệu offline
  const sendOfflineSignal = () => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: "/app/offline",
        body: "",
      });
      console.log("📤 Sent /app/offline signal");
    }
  };

  // 👇 Gọi khi logout
  const deactivateClient = async () => {
    await sendOfflineSignal();
    if (clientRef.current?.active) {
      await clientRef.current.deactivate();
      console.log("🛑 STOMP manually deactivated on logout");
    }
  };

  return { deactivateClient, sendOfflineSignal }; // ✅ TRẢ RA ĐẦY ĐỦ
};


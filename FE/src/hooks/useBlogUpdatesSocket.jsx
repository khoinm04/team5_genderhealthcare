import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export const useBlogUpdatesSocket = (onNewBlog) => {
  const clientRef = useRef(null);
  const onNewBlogRef = useRef(onNewBlog);

  useEffect(() => {
    onNewBlogRef.current = onNewBlog;
  }, [onNewBlog]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!storedUser) return;

    let token = null;

    try {
      const parsedUser = JSON.parse(storedUser);
      token = parsedUser?.token;
    } catch (e) {
      console.error("❌ Failed to parse user storage:", e);
      return;
    }

    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new WebSocket("ws://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("📡 Blog STOMP:", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Kết nối blog STOMP");

        client.subscribe("/topic/blog-updates", (message) => {
          try {
            const newBlog = JSON.parse(message.body);
            console.log("🆕 Bài viết mới:", newBlog);
            onNewBlogRef.current(newBlog);
          } catch (e) {
            console.error("❌ Failed to parse blog message:", e);
          }
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
        console.log("🛑 STOMP blog client deactivated");
      }
    };
  }, []);
};

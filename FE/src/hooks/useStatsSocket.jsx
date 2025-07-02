// src/hooks/useStatsSocket.js
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export const useStatsSocket = (onStatsUpdateFull, onStatsUpdateToday) => {
  const clientRef = useRef(null);
  const fullRef = useRef(onStatsUpdateFull);
  const todayRef = useRef(onStatsUpdateToday);

  useEffect(() => {
    fullRef.current = onStatsUpdateFull;
    todayRef.current = onStatsUpdateToday;
  }, [onStatsUpdateFull, onStatsUpdateToday]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => {
        console.log("📊 WebSocket connecting to ws://localhost:8080/ws");
        return new WebSocket("ws://localhost:8080/ws");
      },
      debug: (str) => console.log("📡 STOMP [Stats]:", str),
      onConnect: () => {
        console.log("✅ Connected to STATS WebSocket");

        // ✅ Nhận toàn bộ biểu đồ
        client.subscribe("/topic/stats-update", (message) => {
          try {
            const stats = JSON.parse(message.body);
            fullRef.current?.(stats);
          } catch (e) {
            console.error("❌ Failed to parse stats-update:", e);
          }
        });

        // ✅ Nhận 1 điểm hôm nay
        client.subscribe("/topic/stats-today", (message) => {
          try {
            const todayStat = JSON.parse(message.body);
            todayRef.current?.(todayStat);
          } catch (e) {
            console.error("❌ Failed to parse stats-today:", e);
          }
        });
      },
      onDisconnect: () => console.log("🛑 Disconnected STATS"),
      onStompError: (frame) => console.error("❌ STATS error:", frame),
      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
        console.log("🛑 Stats STOMP deactivated");
      }
      clientRef.current = null;
    };
  }, []);
};

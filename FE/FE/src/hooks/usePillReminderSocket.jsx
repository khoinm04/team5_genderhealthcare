import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import PillReminderToast from "../components/Pill/PillReminderToast";

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
                        const body = message.body;

                        // ✅ BỎ QUA nếu là thông báo xác nhận uống thuốc
                        if (body.startsWith("✅ Đã xác nhận uống viên")) {
                            console.log("🔕 Bỏ qua toast vì đây là thông báo xác nhận.");
                            return;
                        }

                        // ✅ BỎ QUA nếu vừa mới xác nhận (trong vòng vài giây)
                        if (window.justConfirmed) {
                            console.log("🔕 Vừa xác nhận nên không hiển thị nhắc.");
                            return;
                        }

                        // 🧠 Lấy ngày hôm nay
                        const today = new Date();
                        const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

                        // 🧠 Kiểm tra pillHistory từ localStorage
                        const pillHistory = JSON.parse(localStorage.getItem("pillHistory") || "{}");
                        const alreadyTaken = pillHistory[todayStr] === true;

                        if (alreadyTaken) {
                            console.log("🟢 Đã uống hôm nay rồi, không hiện toast nhắc nữa.");
                            return;
                        }

                        // 🧠 Trích xuất thông tin viên thuốc từ message
                        const regex = /viên thứ (\d+) của vỉ (\d+) viên/;
                        const match = body.match(regex);

                        let pillIndex = null;
                        let pillType = null;

                        if (match) {
                            pillIndex = parseInt(match[1], 10);
                            pillType = match[2];
                        }

                        toast.info(
                            <PillReminderToast pillIndex={pillIndex} pillType={pillType} />,
                            {
                                position: "top-right",
                                autoClose: 10000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                style: {
                                    backgroundColor: "#ebf8ff",
                                    borderLeft: "6px solid #3182ce",
                                    borderRadius: "10px",
                                    padding: "12px",
                                },
                                icon: false,
                            }
                        );

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
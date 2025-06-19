// src/pages/GoogleCallback.jsx
import { useEffect } from "react";
import axios from "axios";

const GoogleCallback = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      axios
        .get("http://localhost:8080/gender-health-care/signingoogle", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.user;
          localStorage.setItem("user", JSON.stringify({
            ...user,
            token
          }));
          console.log("Đăng nhập thành công qua Google:", user);
          window.location.replace("/"); // ← Chuyển về trang chính
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin user:", err);
          window.location.replace("/login"); // ← Chuyển về trang login nếu lỗi
        });
    } else {
      console.error("Không tìm thấy token trong URL");
      window.location.replace("/login");
    }
  }, []);

  return <p>Đang đăng nhập, vui lòng chờ...</p>;
};

export default GoogleCallback;
